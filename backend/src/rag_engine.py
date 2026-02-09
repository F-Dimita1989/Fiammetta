from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from src.rag_loader import load_and_split_knowledge


class RagEngine:
    def __init__(self, collection_name="home_assistant_knowledge"):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        path = "qdrant_db"
        self.vector_store = None
        self.client_raw = None

        try:
            self.client_raw = QdrantClient(path=path)
            self.vector_store = QdrantVectorStore(
                client=self.client_raw,
                collection_name=collection_name,
                embedding=self.embeddings,
            )

            try:
                if self.client_raw.count(collection_name).count == 0:
                    self.index_knowledge_base()
            except Exception:
                self.index_knowledge_base()
        except Exception:
            print("[RAG] Database locked or unavailable.")
            self.vector_store = None

    def index_knowledge_base(self):
        docs = load_and_split_knowledge()
        if docs and self.vector_store:
            self.vector_store.add_documents(docs)

    def search(self, query: str, limit: int = 3) -> list:
        if not self.vector_store:
            return []

        docs_and_scores = self.vector_store.similarity_search_with_score(query, k=limit)
        return [doc.page_content for doc, score in docs_and_scores]

    def close(self):
        if self.client_raw:
            self.client_raw.close()
