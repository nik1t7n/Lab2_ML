from fastapi import APIRouter, Depends

from api.dependencies import get_store_service
from services.store import StoreService

router = APIRouter()


@router.get("/all",
            summary="Get all stores",
            description="Retrieve information about all existing stores")
def all_routes(
        store_service: StoreService = Depends(get_store_service),
        limit: int = 5, offset: int = 0):
    stores = store_service.get_all_stores(limit, offset)
    return stores
