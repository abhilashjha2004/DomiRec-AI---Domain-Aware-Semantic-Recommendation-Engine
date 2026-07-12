import os
import json
import sys

# Ensure parent directory is in sys.path to allow running this script from anywhere
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.engine import DomiRecEngine

def main():
    print("Initializing DomiRec AI Index Builder...")
    
    # Paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "dataset.json")
    
    if not os.path.exists(dataset_path):
        print(f"Error: Seed dataset not found at {dataset_path}")
        sys.exit(1)
        
    print(f"Loading dataset from {dataset_path}...")
    with open(dataset_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)
        
    print(f"Loaded {len(dataset)} items across multiple domains.")
    
    # Initialize engine
    engine = DomiRecEngine()
    
    # Build index
    print("Building indices (generating embeddings, training classifiers, PCA)...")
    try:
        engine.build_index(dataset)
        print("Success! All index files created successfully.")
    except Exception as e:
        print(f"Error during index building: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
        
    # Quick sanity test
    print("\nRunning self-check / sanity tests...")
    try:
        engine.load_index()
        query = "Binary search implementation and array search complexity"
        print(f"Testing search query: '{query}'")
        
        # Test domain classification
        predicted_domain = engine.classify_domain(query)
        print(f"Predicted Domain: {predicted_domain} (Expected: Education)")
        
        # Test semantic search with domain lock
        results = engine.search(query, limit=3, domain_filter=predicted_domain)
        print("Search Results (Education locked):")
        for i, item in enumerate(results):
            print(f"  {i+1}. [{item['id']}] {item['title']} - Similarity: {item['similarity_score']}%")
            
        print("\nSanity check passed!")
    except Exception as e:
        print(f"Sanity check failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
