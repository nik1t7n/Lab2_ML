from fastapi import Depends

from db.database import get_connection


def get_product_name_by_id(product_id: int, conn=Depends(get_connection)):
    cursor = conn.cursor()

    query = "SELECT name FROM products WHERE id = ?"
    product_name = cursor.execute(query, (product_id,)).fetchone()
    return product_name


def get_store_name_by_id(store_id: int, conn=Depends(get_connection)):
    cursor = conn.cursor()

    query = "SELECT name FROM stores WHERE id = ?"
    store_name = cursor.execute(query, (store_id,)).fetchone()
    return store_name
