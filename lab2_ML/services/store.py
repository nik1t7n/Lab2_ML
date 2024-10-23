from fastapi import HTTPException

from repositories.store import StoreRepository


class StoreService:
    def __init__(self, store_repository: StoreRepository):
        self.store_repository = store_repository

    def get_all_stores(self, limit: int = 5, offset: int = 0):
        try:
            return self.store_repository.get_all_stores(limit, offset)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        