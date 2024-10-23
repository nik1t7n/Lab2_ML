from fastapi import APIRouter
from api.routes import store
from api.routes import product
from api.routes import sale

api_router = APIRouter()

api_router.include_router(
    store.router,
    tags=['Stores'],
    prefix='/stores'
)

api_router.include_router(
    product.router,
    tags=['Products'],
    prefix='/products'
)

api_router.include_router(
    sale.router,
    tags=['Sales'],
    prefix='/sales'
)