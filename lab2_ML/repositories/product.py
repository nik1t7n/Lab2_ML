from repositories.base import BaseRepository


class ProductRepository(BaseRepository):

    def get_all_products(self, limit: int = 5, offset: int = 0):
        cursor = self.connection.cursor()

        query = """
            SELECT product, price 
            FROM products
            LIMIT ? OFFSET ?
        """
        cursor.execute(query, (limit, offset))
        products = cursor.fetchall()

        count_query = """
            SELECT COUNT(*)
            FROM products
        """
        cursor.execute(count_query)
        total_count = cursor.fetchone()[0]

        products_dict = [
            {
                'product_name': product[0],
                "quantity": int(product[1])
            }
            for product in products
        ]

        return {
            "products": products_dict,
            "total_count": total_count,
            "limit": limit,
            "offset": offset,
            "current_page": (offset // limit) + 1,
            "total_pages": (total_count + limit - 1) // limit
        }
