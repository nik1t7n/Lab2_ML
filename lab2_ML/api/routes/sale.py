from datetime import datetime

from fastapi import APIRouter, Depends

from api.dependencies import get_sale_service
from services.sale import SaleService

router = APIRouter()


@router.get("/all",
            summary="Get all sales",
            description="Retrieve information about all existing sales using "
                        "filtering by date range, store name or product name")
def all_sales(
        sale_service: SaleService = Depends(get_sale_service),
        start_date: datetime = None,
        end_date: datetime = None,
        store_filter: str = None,
        product_filter: str = None,
        limit: int = 10,
        offset: int = 0
):
    return sale_service.get_all_sales(
        start_date,
        end_date,
        store_filter,
        product_filter,
        limit,
        offset)
