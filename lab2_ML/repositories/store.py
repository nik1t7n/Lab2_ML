from repositories.base import BaseRepository


class StoreRepository(BaseRepository):

    def get_all_stores(self, limit: int = 5, offset: int = 0):
        cursor = self.connection.cursor()

        query = """
            SELECT name, address, working_time 
            FROM stores
            LIMIT ? OFFSET ?
        """
        cursor.execute(query, (limit, offset))

        stores = cursor.fetchall()

        count_query = """
            SELECT COUNT(*)
            FROM stores
        """

        cursor.execute(count_query)
        total_count = cursor.fetchone()[0]

        stores_dict = [
            {
                "store_name": store[0],
                "address": store[1],
                "working_time": store[2]
            }
            for store in stores
        ]

        return {
            "stores": stores_dict,
            "total_count": total_count,
            "limit": limit,
            "offset": offset,
            "current_page": (offset // limit) + 1,
            "total_pages": (total_count + limit - 1) // limit
        }
