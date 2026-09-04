import os

class Settings:
    PROJECT_NAME: str = "IDR NAV - Intelligent Dead Reckoning & GNSS Fusion"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./idr_nav.db")
    SAMPLE_DATASET_PATH: str = "data/sample/io_vnbd_sample.csv"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

settings = Settings()
