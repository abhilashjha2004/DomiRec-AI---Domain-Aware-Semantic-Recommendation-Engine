import os
import sys
import unittest
import shutil
import tempfile
import json

# Ensure parent directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.engine import DomiRecEngine

class TestOfflineEngine(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory for datasets, embeddings, and models
        self.test_dir = tempfile.mkdtemp()
        
        # Setup directories
        self.gaming_dir = os.path.join(self.test_dir, "gaming")
        os.makedirs(self.gaming_dir, exist_ok=True)
        
        # Seed test items in JSON
        self.gaming_data = [
            {
                "id": "game_test_1",
                "title": "Elden Ring Strategy",
                "description": "Defeat bosses, locate secrets and map out builds inside Elden Ring.",
                "tags": "rpg, gameplay, action",
                "keywords": "elden ring, boss, guide",
                "difficulty": "Hard",
                "popularity": 90
            },
            {
                "id": "game_test_2",
                "title": "Minecraft Survival",
                "description": "Construct shelter, mine resources, and survive the night in Minecraft.",
                "tags": "sandbox, survival, creative",
                "keywords": "minecraft, mine, craft",
                "difficulty": "Easy",
                "popularity": 95
            }
        ]
        
        with open(os.path.join(self.gaming_dir, "data.json"), "w", encoding="utf-8") as f:
            json.dump(self.gaming_data, f, indent=2)
            
        # Initialize engine pointing to the temp dir
        self.engine = DomiRecEngine(data_dir=self.test_dir)

    def tearDown(self):
        # Remove the directory after the test
        shutil.rmtree(self.test_dir)

    def test_offline_scanner_and_indexer(self):
        # 1. Build indices (first run, should compute embeddings)
        self.engine.build_or_load_indices()
        
        self.assertIn("gaming", self.engine.metadata)
        self.assertEqual(len(self.engine.metadata["gaming"]), 2)
        
        # Check cache was created
        cache_path = os.path.join(self.engine.embeddings_dir, "embeddings_cache.pkl")
        self.assertTrue(os.path.exists(cache_path))
        
        # 2. Search inside Gaming index
        results = self.engine.search("Elden Ring guide and boss tricks", domain="Gaming", limit=5)
        self.assertTrue(len(results) > 0)
        self.assertEqual(results[0]["id"], "game_test_1")
        self.assertTrue(results[0]["similarity_score"] > 50)
        
        # 3. Add a new item in a new file (incremental load test)
        new_item = {
            "id": "game_test_3",
            "title": "Cyberpunk builds",
            "description": "Maximize cyberware stats and weapon damage in Cyberpunk.",
            "tags": ["fps", "rpg", "cyberpunk"],
            "keywords": ["cyberpunk", "builds"],
            "difficulty": "Medium",
            "popularity": 85
        }
        
        with open(os.path.join(self.gaming_dir, "new_data.json"), "w", encoding="utf-8") as f:
            json.dump([new_item], f, indent=2)
            
        # Re-run builder
        self.engine.build_or_load_indices()
        
        # Gaming metadata should now have 3 items
        self.assertEqual(len(self.engine.metadata["gaming"]), 3)
        
        # Search for Cyberpunk
        results = self.engine.search("Cyberpunk stat builds", domain="Gaming", limit=5)
        self.assertEqual(results[0]["id"], "game_test_3")

if __name__ == "__main__":
    unittest.main()
