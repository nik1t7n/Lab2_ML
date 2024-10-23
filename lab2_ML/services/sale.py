from datetime import datetime

from fastapi import HTTPException


class SaleService:
    def __init__(self, sale_repository):
        self.sale_repository = sale_repository

    def get_all_sales(
                      self,
                      start_date: datetime = None,
                      end_date: datetime = None,
                      store_filter: str = None,
                      product_filter: str = None,
                      limit: int = 10,
                      offset: int = 0
            ):
        try:
            return self.sale_repository.get_all_sales(
                start_date, end_date, store_filter, product_filter,
                limit, offset
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))