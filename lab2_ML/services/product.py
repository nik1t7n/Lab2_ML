from fastapi import HTTPException


class ProductService:
    def __init__(self, product_repository):
        self.product_repository = product_repository

    def get_all_products(self, limit: int = 5, offset: int = 0):
        try:
            return self.product_repository.get_all_products(limit, offset)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))