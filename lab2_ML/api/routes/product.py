from fastapi import APIRouter, Depends

from api.dependencies import get_product_service
from services.product import ProductService

router = APIRouter()


@router.get("/all",
            summary="Get all products",
            description="Retrieve information about all existing products")
def all_products(product_service: ProductService = Depends(get_product_service),
                 limit: int = 5, offset: int = 0):
    return product_service.get_all_products(limit, offset)
