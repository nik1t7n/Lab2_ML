from datetime import datetime

from fastapi import HTTPException

from repositories.base import BaseRepository


class SaleRepository(BaseRepository):

    def get_all_sales(
            self,
            start_date: datetime = None,
            end_date: datetime = None,
            store_filter: str = None,
            product_filter: str = None,
            limit: int = 10,
            offset: int = 0):

        cursor = self.connection.cursor()

        # Основной запрос для получения данных о продажах
        query = """
            SELECT sales.date, sales.quantity, stores.name as store_name, products.product as product_name
            FROM sales
            JOIN stores ON sales.store_id = stores.id
            JOIN products ON sales.product_id = products.id
            WHERE 1=1
        """

        # Запрос для получения общего количества записей (для пагинации)
        count_query = """
            SELECT COUNT(*)
            FROM sales
            JOIN stores ON sales.store_id = stores.id
            JOIN products ON sales.product_id = products.id
            WHERE 1=1
        """

        # Запрос для получения агрегированных значений
        stats_query = """
            SELECT SUM(sales.quantity) AS total_quantity_sold,
                   SUM(sales.quantity * products.price) AS total_sales_amount
            FROM sales
            JOIN stores ON sales.store_id = stores.id
            JOIN products ON sales.product_id = products.id
            WHERE 1=1
        """

        # Параметры для фильтров
        params = []
        count_params = []
        stats_params = []

        if start_date:
            condition = " AND sales.date >= ?"
            query += condition
            count_query += condition
            stats_query += condition

            params.append(start_date)
            count_params.append(start_date)
            stats_params.append(start_date)

        if end_date:
            condition = " AND sales.date <= ?"
            query += condition
            count_query += condition
            stats_query += condition

            params.append(end_date)
            count_params.append(end_date)
            stats_params.append(end_date)

        if store_filter:
            condition = " AND stores.name = ?"
            query += condition
            count_query += condition
            stats_query += condition

            params.append(store_filter)
            count_params.append(store_filter)
            stats_params.append(store_filter)

        if product_filter:
            condition = " AND products.product = ?"
            query += condition
            count_query += condition
            stats_query += condition

            params.append(product_filter)
            count_params.append(product_filter)
            stats_params.append(product_filter)

        # Параметры для пагинации (только для основного запроса)
        query += " LIMIT ? OFFSET ?"
        params.append(limit)
        params.append(offset)

        # Выполняем основной запрос для получения данных о продажах
        cursor.execute(query, params)
        sales = cursor.fetchall()

        # Выполняем запрос для подсчета общего количества записей
        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()[0]

        # Выполняем запрос для получения агрегированных значений
        cursor.execute(stats_query, stats_params)
        stats = cursor.fetchone()

        sales_dict = [
            {
                "date": item[0],
                "quantity": item[1],
                "store_name": item[2],
                "product_name": item[3]
            }
            for item in sales
        ]

        return {
            "sales": sales_dict,
            "total_count": total_count,
            "limit": limit,
            "offset": offset,
            "current_page": (offset // limit) + 1,
            "total_pages": (total_count + limit - 1) // limit,  # округление вверх
            "statistics": {
                "total_quantity_sold": stats[0] if stats[0] is not None else 0,
                "total_sales_amount": stats[1] if stats[1] is not None else 0
            }
        }
