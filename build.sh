#!/usr/bin/env bash
# build.sh — Render build script for DomiRec AI backend
set -e  # exit immediately on any error

echo "==> [Build] Step 1: Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> [Build] Step 2: Caching SentenceTransformer model..."
python -c "
import os
os.environ['SENTENCE_TRANSFORMERS_HOME'] = '/opt/render/project/src/.cache/sentence_transformers'
from sentence_transformers import SentenceTransformer
SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print('[Build] SentenceTransformer model cached successfully.')
"

echo "==> [Build] Step 3: Pre-building FAISS indices..."
python -c "
import sys, os
sys.path.insert(0, '.')
os.environ['SENTENCE_TRANSFORMERS_HOME'] = '/opt/render/project/src/.cache/sentence_transformers'
from ml.engine import DomiRecEngine
engine = DomiRecEngine()
engine.build_or_load_indices(force_rebuild=False)
print('[Build] FAISS indices ready.')
"

echo "==> [Build] All build steps completed successfully."
