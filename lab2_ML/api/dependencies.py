from fastapi import Depends

from db.database import get_connection
from repositories.product import ProductRepository
from repositories.sale import SaleRepository
from repositories.store import StoreRepository
from services.product import ProductService
from services.sale import SaleService
from services.store import StoreService


def get_store_repository(conn=Depends(get_connection)):
    return StoreRepository(conn)


def get_product_repository(conn=Depends(get_connection)):
    return ProductRepository(conn)


def get_sale_repository(conn=Depends(get_connection)):
    return SaleRepository(conn)


def get_store_service(store_repository: StoreRepository = Depends(get_store_repository)):
    return StoreService(store_repository)


def get_product_service(product_repository: ProductRepository = Depends(get_product_repository)):
    return ProductService(product_repository)


def get_sale_service(sale_repository: SaleRepository = Depends(get_sale_repository)):
    return SaleService(sale_repository)
