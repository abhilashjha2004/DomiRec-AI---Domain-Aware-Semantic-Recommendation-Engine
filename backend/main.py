import os
import sys
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware

# Ensure parent directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.engine import DomiRecEngine

# Initialize engine
engine = DomiRecEngine()

app = FastAPI(title="DomiRec AI API", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("FastAPI server starting...")
    try:
        engine.build_or_load_indices()
        print("ML Engine loaded successfully.")
    except Exception as e:
        print(f"Error loading ML index: {e}")

# Pydantic schemas
class SearchRequest(BaseModel):
    query: str
    domain_lock: bool = False
    current_domain: Optional[str] = None

class RecommendationRequest(BaseModel):
    content_id: str
    domain_lock: bool = True
    personalize: bool = True

# Domain Endpoints
@app.get("/api/domains")
async def get_domains():
    return engine.get_domains()

# Content Endpoints
@app.get("/api/content")
async def get_content(domain: Optional[str] = None):
    if domain:
        domain_key = domain.lower()
        return engine.metadata.get(domain_key, [])
    else:
        all_items = []
        for items in engine.metadata.values():
            all_items.extend(items)
        all_items.sort(key=lambda x: x.get("id", ""))
        return all_items

@app.get("/api/content/{content_id}")
async def get_content_detail(content_id: str):
    found_item = None
    for items in engine.metadata.values():
        for item in items:
            if item["id"] == content_id:
                found_item = item.copy()
                break
        if found_item:
            break
            
    if not found_item:
        raise HTTPException(status_code=404, detail="Content not found")
        
    return found_item

# Semantic Search Endpoint
@app.post("/api/content/search")
async def search_content(req: SearchRequest):
    current_dom = req.current_domain or "Education"
    print(f"Offline Search Query: '{req.query}' in Domain: '{current_dom}'")
    
    # 1. Search inside current locked domain
    results = engine.search(req.query, domain=current_dom, limit=15)
    
    # 2. Check if the query fits another domain better by sorting globally
    global_results = engine.search(req.query, domain=None, limit=1)
    best_fit_domain = engine.classify_domain(req.query)
    
    suggested_domain = None
    
    if global_results:
        top_hit = global_results[0]
        # If there is a high similarity match in another domain, recommend switching
        if top_hit["similarity_score"] >= 80 and top_hit["domain"].lower() != current_dom.lower():
            suggested_domain = top_hit["domain"]
            
    # Or fallback to keyword-based domain classifier
    if not suggested_domain and best_fit_domain.lower() != current_dom.lower():
        other_results = engine.search(req.query, domain=best_fit_domain, limit=1)
        if other_results and other_results[0]["similarity_score"] >= 75:
            suggested_domain = best_fit_domain

    return {
        "query": req.query,
        "detected_domain": current_dom,
        "results": results,
        "suggested_domain": suggested_domain
    }

# Recommendation Engine Endpoint
@app.post("/api/recommendations")
async def get_recommendations(req: RecommendationRequest):
    seed_item = None
    for items in engine.metadata.values():
        for item in items:
            if item["id"] == req.content_id:
                seed_item = item
                break
        if seed_item:
            break
            
    if not seed_item:
        raise HTTPException(status_code=404, detail="Content not found")
        
    domain = seed_item["domain"]
    
    # Fetch semantic candidates using title + description inside the same domain
    search_text = f"Title: {seed_item['title']}. Description: {seed_item['description']}."
    candidates = engine.search(search_text, domain=domain, limit=15, exclude_ids=[req.content_id])
    
    ranked_results = []
    for item in candidates:
        sim_score = item["similarity_score"]
        rec_score = sim_score
        
        # Popularity boost (+5 pts max)
        popularity = item.get("popularity", 50)
        pop_boost = int(popularity * 0.05)
        if pop_boost > 0:
            rec_score += pop_boost
            
        final_score = max(0, min(100, int(rec_score)))
        
        # Construct context-aware dynamic reason
        shared_tags = list(set(item.get("tags", []) or []) & set(seed_item.get("tags", []) or []))
        
        if domain == "Movies" and ("marvel" in [t.lower() for t in item.get("tags", [])] or "avengers" in item["title"].lower() or "avengers" in seed_item["title"].lower()):
            explanation_str = "Recommended because it belongs to the Marvel Cinematic Universe and shares superhero themes."
        elif domain == "Movies" and any(w in item["title"].lower() for w in ["inception", "interstellar", "tenet", "memento", "prestige"]):
            explanation_str = "Recommended because it is a mind-bending sci-fi/thriller sharing director style."
        elif shared_tags:
            tags_str = ", ".join(shared_tags[:3])
            explanation_str = f"Recommended because it shares similar tags: '{tags_str}'."
        else:
            explanation_str = f"Recommended because it belongs to the {domain} category and shares related themes."
        
        item_copy = item.copy()
        item_copy["recommendation_score"] = final_score
        item_copy["explanation"] = explanation_str
        ranked_results.append(item_copy)
        
    ranked_results.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return ranked_results

# Learning Paths Roadmap Endpoint
@app.get("/api/learning-paths")
async def get_learning_path(root_id: str = Query(..., description="The ID of the starting content")):
    content_map = {}
    for items in engine.metadata.values():
        for item in items:
            content_map[item["id"]] = item
            
    if root_id not in content_map:
        raise HTTPException(status_code=404, detail="Root content not found")
        
    root_item = content_map[root_id]
    domain = root_item["domain"]
    
    roadmap_nodes = []
    roadmap_edges = []
    
    visited = set()
    queue = [root_id]
    
    while queue:
        current_id = queue.pop(0)
        if current_id in visited:
            continue
        visited.add(current_id)
        
        item = content_map[current_id]
        roadmap_nodes.append({
            "id": item["id"],
            "title": item["title"],
            "difficulty": item.get("difficulty"),
            "duration": item.get("duration"),
            "domain": item["domain"],
            "x": item.get("x", 0.0),
            "y": item.get("y", 0.0)
        })
        
        children = []
        for cid, info in content_map.items():
            if info["domain"] == domain and current_id in info.get("prerequisites", []):
                children.append(cid)
                if cid not in visited:
                    queue.append(cid)
                    
        for child_id in children:
            roadmap_edges.append({
                "source": current_id,
                "target": child_id
            })
            
    return {
        "nodes": roadmap_nodes,
        "edges": roadmap_edges
    }

# Homepage Rows Endpoint
@app.get("/api/home")
async def get_home():
    data_dict = {
        "trending": [],
        "education": engine.metadata.get("education", []),
        "movies": engine.metadata.get("movies", []),
        "sports": engine.metadata.get("sports", []),
        "blogging": engine.metadata.get("blogging", []),
        "entertainment": engine.metadata.get("entertainment", []),
        "technology": engine.metadata.get("technology", []),
        "gaming": engine.metadata.get("gaming", []),
        "books": engine.metadata.get("books", []),
        "music": engine.metadata.get("music", []),
        "news": engine.metadata.get("news", []),
        "finance": engine.metadata.get("finance", []),
        "health": engine.metadata.get("health", [])
    }
    
    all_items = []
    for k, v in data_dict.items():
        if k != "trending":
            all_items.extend(v)
            
    all_items.sort(key=lambda x: x.get("popularity", 50), reverse=True)
    data_dict["trending"] = all_items[:10]
    
    return data_dict

# Index Refresh Endpoint
@app.get("/api/refresh")
async def refresh_indices():
    try:
        engine.build_or_load_indices(force_rebuild=True)
        return {"status": "success", "message": "Indices successfully refreshed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
