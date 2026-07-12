import os
import json
import csv
import pickle
import hashlib
import numpy as np

# Globals for lazy loading
SentenceTransformer = None
faiss = None
PCA = None

def _lazy_imports():
    global SentenceTransformer, faiss, PCA
    if SentenceTransformer is None:
        try:
            from sentence_transformers import SentenceTransformer as ST
            SentenceTransformer = ST
            print("Successfully imported SentenceTransformer")
        except ImportError:
            print("Warning: sentence-transformers is not installed.")
    if faiss is None:
        try:
            import faiss as f
            faiss = f
            print("Successfully imported FAISS")
        except ImportError:
            print("Warning: FAISS is not installed. Will use NumPy fallback.")
    if PCA is None:
        try:
            from sklearn.decomposition import PCA as SkPCA
            PCA = SkPCA
            print("Successfully imported PCA")
        except ImportError:
            print("Warning: sklearn.decomposition.PCA is not installed.")

class DomiRecEngine:
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
        else:
            self.data_dir = data_dir
            
        self.embeddings_dir = os.path.join(self.data_dir, "embeddings")
        self.models_dir = os.path.join(self.data_dir, "models")
        
        os.makedirs(self.embeddings_dir, exist_ok=True)
        os.makedirs(self.models_dir, exist_ok=True)
        
        self.model = None
        
        # Domain data dictionaries: domain_name (lowercase) -> data
        self.indices = {}          # domain -> FAISS index
        self.metadata = {}         # domain -> list of items
        self.embeddings_matrices = {} # domain -> np.array of embeddings
        self.pcas = {}             # domain -> PCA model
        
    def load_model(self):
        _lazy_imports()
        if self.model is None:
            if SentenceTransformer is None:
                raise ImportError("sentence-transformers is not available. Please install it first.")
            print("Loading sentence-transformer model 'all-MiniLM-L6-v2'...")
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            print("Model loaded successfully.")

    def get_embedding(self, text):
        if self.model is None:
            self.load_model()
        emb = self.model.encode(text, convert_to_numpy=True)
        norm = np.linalg.norm(emb)
        if norm > 0:
            emb = emb / norm
        return emb

    def get_embeddings(self, texts):
        if self.model is None:
            self.load_model()
        embs = self.model.encode(texts, convert_to_numpy=True)
        norms = np.linalg.norm(embs, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return embs / norms

    def _prepare_text_for_embedding(self, item):
        title = item.get("title", "")
        desc = item.get("description", "")
        tags = ", ".join(item.get("tags", []))
        keywords = ", ".join(item.get("keywords", []))
        return f"Title: {title}. Description: {desc}. Tags: {tags}. Keywords: {keywords}"

    def load_embeddings_cache(self):
        cache_path = os.path.join(self.embeddings_dir, "embeddings_cache.pkl")
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "rb") as f:
                    return pickle.load(f)
            except Exception as e:
                print(f"Error loading embeddings cache: {e}")
        return {}

    def save_embeddings_cache(self, cache):
        cache_path = os.path.join(self.embeddings_dir, "embeddings_cache.pkl")
        try:
            with open(cache_path, "wb") as f:
                pickle.dump(cache, f)
        except Exception as e:
            print(f"Error saving embeddings cache: {e}")

    def scan_datasets(self):
        """
        Scan subdirectories under data/ (excluding models, embeddings, etc.)
        to locate domain folders and parse JSON/CSV files.
        """
        ignored_dirs = {"embeddings", "models", "__pycache__", "venv"}
        domain_items = {}
        
        if not os.path.exists(self.data_dir):
            print(f"Warning: data_dir '{self.data_dir}' does not exist.")
            return domain_items

        for item_name in os.listdir(self.data_dir):
            item_path = os.path.join(self.data_dir, item_name)
            if os.path.isdir(item_path) and item_name not in ignored_dirs:
                domain_name = item_name.capitalize()
                try:
                    items = self._load_domain_files(item_path, domain_name)
                    if items:
                        domain_items[domain_name] = items
                        # Requirement 14: Add debug logs showing Loaded Domain: XX items
                        print(f"Loaded {domain_name}: {len(items)} items")
                    else:
                        print(f"Loaded {domain_name}: 0 items")
                except Exception as e:
                    # Requirement 11: display the exact folder/file causing the problem in backend logs
                    print(f"CRITICAL ERROR: Failed to load dataset in folder '{item_path}': {e}")
                    raise e
                    
        return domain_items

    def _load_domain_files(self, folder_path, domain_name):
        items = []
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if not os.path.isfile(file_path):
                continue
                
            ext = os.path.splitext(filename)[1].lower()
            if ext == ".json":
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if isinstance(data, list):
                            for obj in data:
                                items.append(self._normalize_item(obj, domain_name))
                        elif isinstance(data, dict):
                            items.append(self._normalize_item(data, domain_name))
                except Exception as e:
                    # Requirement 11: Display the exact filename causing the problem
                    error_msg = f"CRITICAL ERROR: Failed to parse JSON dataset file: '{file_path}'. Error: {e}"
                    print(error_msg)
                    raise Exception(error_msg)
                    
            elif ext == ".csv":
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            items.append(self._normalize_item(row, domain_name))
                except Exception as e:
                    # Requirement 11: Display the exact filename causing the problem
                    error_msg = f"CRITICAL ERROR: Failed to parse CSV dataset file: '{file_path}'. Error: {e}"
                    print(error_msg)
                    raise Exception(error_msg)
        return items

    def _normalize_item(self, item, domain_name):
        title = item.get("title", "").strip()
        description = item.get("description", "").strip()
        
        # Calculate text hash to detect updates
        text_repr = f"Title: {title}. Description: {description}"
        text_hash = hashlib.sha256(text_repr.encode('utf-8')).hexdigest()
        
        # Generate hash-based ID if missing
        item_id = item.get("id") or item.get("ID")
        if not item_id:
            item_id = f"{domain_name.lower()}_{text_hash[:12]}"
            
        category = item.get("category") or item.get("domain") or domain_name
        
        # Normalize tags
        tags = item.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
            
        # Normalize keywords
        keywords = item.get("keywords") or []
        if isinstance(keywords, str):
            keywords = [k.strip() for k in keywords.split(",") if k.strip()]
            
        difficulty = item.get("difficulty")
        if difficulty == "":
            difficulty = None
            
        duration = item.get("duration")
        try:
            duration = int(duration) if duration else 0
        except ValueError:
            duration = 0
            
        popularity = item.get("popularity")
        try:
            popularity = int(popularity) if popularity else 50
        except ValueError:
            popularity = 50

        return {
            "id": str(item_id),
            "title": title,
            "description": description,
            "category": str(category),
            "domain": domain_name,
            "tags": tags,
            "difficulty": difficulty,
            "keywords": keywords,
            "thumbnail": item.get("thumbnail", ""),
            "source_url": item.get("source_url", ""),
            "duration": duration,
            "popularity": popularity
        }

    def build_or_load_indices(self, force_rebuild=False):
        """
        Startup sequence:
        1. Scan datasets folder.
        2. Identify new or modified items using hash matching.
        3. Load existing indexes or build them.
        """
        _lazy_imports()
        self.load_model()
        
        domain_items = self.scan_datasets()
        embeddings_cache = self.load_embeddings_cache()
        cache_updated = False
        
        print("Processing datasets and generating embeddings offline...")
        
        for domain, items in domain_items.items():
            domain_key = domain.lower()
            self.metadata[domain_key] = items
            
            # Check if we need to rebuild the index for this domain
            # We rebuild if force_rebuild is True, or if the index files are missing,
            # or if any item in this domain is not in our cache or has a different hash.
            rebuild_domain = force_rebuild or (domain_key not in self.indices)
            
            # Find embeddings for each item in this domain
            domain_embs = []
            for item in items:
                item_id = item["id"]
                item_text = self._prepare_text_for_embedding(item)
                text_hash = hashlib.sha256(item_text.encode('utf-8')).hexdigest()
                
                # Check cache
                cached_data = embeddings_cache.get(item_id)
                if cached_data and cached_data[1] == text_hash:
                    emb = cached_data[0]
                else:
                    print(f"Generating embedding for: '{item['title']}'...")
                    emb = self.get_embedding(item_text)
                    embeddings_cache[item_id] = (emb, text_hash)
                    cache_updated = True
                    rebuild_domain = True
                    
                domain_embs.append(emb)
                
            if len(domain_embs) > 0:
                self.embeddings_matrices[domain_key] = np.array(domain_embs)
            else:
                self.embeddings_matrices[domain_key] = np.empty((0, 384))
                
            # Build index if required
            index_path = os.path.join(self.embeddings_dir, f"index_{domain_key}.faiss")
            
            if not rebuild_domain and os.path.exists(index_path) and faiss is not None:
                try:
                    self.indices[domain_key] = faiss.read_index(index_path)
                    print(f"Loaded existing FAISS index for domain '{domain}' successfully.")
                except Exception as e:
                    print(f"Error reading index for '{domain}': {e}. Rebuilding...")
                    rebuild_domain = True
                    
            if rebuild_domain and len(domain_embs) > 0:
                print(f"Building/updating index for domain '{domain}' with {len(items)} items...")
                
                # PCA coordinates per domain
                if PCA is not None and len(items) >= 2:
                    try:
                        pca_model = PCA(n_components=2)
                        coords_2d = pca_model.fit_transform(self.embeddings_matrices[domain_key])
                        self.pcas[domain_key] = pca_model
                        
                        # Save PCA model
                        pca_path = os.path.join(self.models_dir, f"pca_{domain_key}.pkl")
                        with open(pca_path, "wb") as f:
                            pickle.dump(pca_model, f)
                            
                        # Add x,y to items
                        for idx, coord in enumerate(coords_2d):
                            items[idx]["x"] = float(coord[0])
                            items[idx]["y"] = float(coord[1])
                    except Exception as e:
                        print(f"Failed to fit PCA for domain {domain}: {e}")
                else:
                    # Dummy projection coords
                    for idx, item in enumerate(items):
                        item["x"] = float(idx % 5)
                        item["y"] = float(idx // 5)
                        
                # Create FAISS Index
                if faiss is not None:
                    dim = self.embeddings_matrices[domain_key].shape[1]
                    index = faiss.IndexFlatIP(dim)
                    index.add(self.embeddings_matrices[domain_key].astype('float32'))
                    self.indices[domain_key] = index
                    faiss.write_index(index, index_path)
                    print(f"Saved FAISS index for '{domain}' successfully.")
                else:
                    self.indices[domain_key] = None
                    print(f"FAISS not available. Using NumPy search for '{domain}'.")
                    
        if cache_updated:
            self.save_embeddings_cache(embeddings_cache)
            print("Embeddings cache updated and saved.")
            
        print("DomiRec Engine initialization complete.")

    def search(self, query_text, domain=None, limit=10, exclude_ids=None, domain_filter=None):
        """
        Perform semantic vector search. If a domain is specified, search only inside that domain.
        Otherwise, search across all domains and merge the results.
        """
        target_domain = domain or domain_filter
        
        if target_domain is None:
            all_results = []
            for dom_key in self.metadata.keys():
                res = self._search_domain(query_text, dom_key, limit=limit, exclude_ids=exclude_ids)
                all_results.extend(res)
            # Sort all results by similarity score descending
            all_results.sort(key=lambda x: x.get("similarity_score", 0), reverse=True)
            return all_results[:limit]
        else:
            return self._search_domain(query_text, target_domain, limit=limit, exclude_ids=exclude_ids)

    def _search_domain(self, query_text, domain, limit=10, exclude_ids=None):
        domain_key = domain.lower()
        if domain_key not in self.metadata:
            print(f"Warning: Domain '{domain}' not found in metadata.")
            return []
            
        items = self.metadata[domain_key]
        if not items:
            return []
            
        # Get query embedding
        query_emb = self.get_embedding(query_text)
        
        scores = []
        indices = []
        
        index = self.indices.get(domain_key)
        embs_matrix = self.embeddings_matrices.get(domain_key)
        
        if index is not None and faiss is not None:
            # Query FAISS
            query_emb_f32 = np.expand_dims(query_emb.astype('float32'), axis=0)
            faiss_scores, faiss_indices = index.search(query_emb_f32, len(items))
            scores = faiss_scores[0].tolist()
            indices = faiss_indices[0].tolist()
        elif embs_matrix is not None and embs_matrix.shape[0] > 0:
            # Fallback to NumPy Cosine Similarity
            sims = np.dot(embs_matrix, query_emb)
            indices = np.argsort(sims)[::-1].tolist()
            scores = [sims[idx] for idx in indices]
        else:
            return []
            
        results = []
        for rank, idx in enumerate(indices):
            if idx == -1 or idx >= len(items):
                continue
                
            item = items[idx]
            item_id = item["id"]
            
            if exclude_ids and item_id in exclude_ids:
                continue
                
            score_raw = float(scores[rank])
            similarity_pct = int(round(((score_raw + 1.0) / 2.0) * 100.0))
            similarity_pct = max(0, min(100, similarity_pct))
            
            item_res = item.copy()
            item_res["similarity_score"] = similarity_pct
            results.append(item_res)
            
            if len(results) >= limit:
                break
                
        return results

    def classify_domain(self, query_text):
        """
        Keyword-based fallback domain classifier for backward compatibility.
        """
        q = query_text.lower()
        if "movie" in q or "film" in q or "sci-fi" in q or "cinema" in q:
            return "Movies"
        elif "sport" in q or "football" in q or "cricket" in q or "ball" in q or "run" in q:
            return "Sports"
        elif "music" in q or "song" in q or "lofi" in q:
            return "Music"
        elif "tech" in q or "quantum" in q or "code" in q or "computer" in q:
            return "Technology"
        elif "game" in q or "xbox" in q or "playstation" in q or "minecraft" in q:
            return "Gaming"
        elif "book" in q or "novel" in q or "read" in q or "pride and prejudice" in q or "mockingbird" in q:
            return "Books"
        elif "blog" in q or "vlog" in q or "routine" in q:
            return "Blogging"
        elif "news" in q or "policy" in q or "summit" in q:
            return "News"
        elif "invest" in q or "stock" in q or "finance" in q or "budget" in q:
            return "Finance"
        elif "health" in q or "stretch" in q or "sleep" in q or "meditation" in q:
            return "Health"
        return "Education"

    def get_domains(self):
        """
        Return the dynamic list of loaded domains.
        """
        domain_list = []
        for domain_key, items in self.metadata.items():
            # Standardize title names
            domain_name = domain_key.capitalize()
            # Match standard icons
            icon = "Layers"
            if domain_name == "Education": icon = "GraduationCap"
            elif domain_name == "Movies": icon = "Film"
            elif domain_name == "Sports": icon = "Trophy"
            elif domain_name == "Music": icon = "Music"
            elif domain_name == "Technology": icon = "Cpu"
            elif domain_name == "Gaming": icon = "Gamepad"
            elif domain_name == "Blogging": icon = "Compass"
            elif domain_name == "Books": icon = "BookOpen"
            elif domain_name == "News": icon = "Newspaper"
            elif domain_name == "Finance": icon = "DollarSign"
            
            domain_list.append({
                "name": domain_name,
                "icon": icon,
                "count": len(items),
                "description": f"Preloaded local dataset with {len(items)} items."
            })
        return sorted(domain_list, key=lambda x: x["name"])

    def get_pca_projection(self, domain, query_text):
        """
        Project query text into PCA space if available.
        """
        domain_key = domain.lower()
        pca_model = self.pcas.get(domain_key)
        
        # Try loading PCA model from disk if missing in memory
        if pca_model is None:
            pca_path = os.path.join(self.models_dir, f"pca_{domain_key}.pkl")
            if os.path.exists(pca_path):
                try:
                    with open(pca_path, "rb") as f:
                        pca_model = pickle.load(f)
                        self.pcas[domain_key] = pca_model
                except Exception:
                    pass
                    
        if pca_model is not None:
            try:
                emb = self.get_embedding(query_text)
                coords = pca_model.transform(np.expand_dims(emb, axis=0))
                return float(coords[0, 0]), float(coords[0, 1])
            except Exception:
                pass
        return 0.0, 0.0

    def build_index(self, dataset):
        """
        Backward compatibility stub for tests.
        """
        for item in dataset:
            domain = item.get("domain", "Education")
            domain_key = domain.lower()
            if domain_key not in self.metadata:
                self.metadata[domain_key] = []
            normalized = self._normalize_item(item, domain)
            self.metadata[domain_key].append(normalized)
            
        self.build_or_load_indices(force_rebuild=True)

    def load_index(self):
        """
        Backward compatibility stub for tests.
        """
        self.build_or_load_indices(force_rebuild=False)
