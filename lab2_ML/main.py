from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api.routes.main import api_router

app = FastAPI()


origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# if __name__ == "__main__":
#
