import os
import sys
import unittest
import asyncio

# Ensure parent directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.engine import DomiRecEngine
from backend.main import get_recommendations, RecommendationRequest

class TestDomiRecEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create engine
        cls.engine = DomiRecEngine()
        # Seed test items directly if index not built
        cls.test_dataset = [
            {
                "id": "edu_test_1",
                "title": "Binary Search Trees",
                "description": "Learn the properties of binary search trees and how to insert elements.",
                "tags": ["dsa", "trees", "bst"],
                "domain": "Education",
                "difficulty": "Intermediate",
                "popularity": 85,
                "duration": 25
            },
            {
                "id": "edu_test_2",
                "title": "Introduction to Tree Data Structures",
                "description": "Foundational course on hierarchical structures, nodes, roots, leaves, and heights.",
                "tags": ["dsa", "trees", "basics"],
                "domain": "Education",
                "difficulty": "Beginner",
                "popularity": 90,
                "duration": 15
            },
            {
                "id": "movie_test_1",
                "title": "Inception",
                "description": "Sci-Fi dream thief Christopher Nolan heist movie about implanting ideas.",
                "tags": ["sci-fi", "thriller", "nolan"],
                "domain": "Movies",
                "popularity": 95,
                "duration": 148
            }
        ]
        
    def test_search_results(self):
        # Build mini memory metadata
        self.engine.metadata = {
            "education": self.test_dataset[:2],
            "movies": self.test_dataset[2:]
        }
        
        # Load small mock matrices
        import numpy as np
        self.engine.embeddings_matrices = {
            "education": np.random.randn(2, 384),
            "movies": np.random.randn(1, 384)
        }
        
        # Verify search executes
        query = "dream tree search"
        results_locked = self.engine.search(query, domain="Education", limit=5)
        for res in results_locked:
            self.assertEqual(res["domain"], "Education")
            
        # Unlocked search (should include Movies as well due to the word "dream")
        results_unlocked = self.engine.search(query, limit=5)
        domains = [res["domain"] for res in results_unlocked]
        self.assertIn("Movies", domains)
        self.assertIn("Education", domains)

if __name__ == "__main__":
    unittest.main()
