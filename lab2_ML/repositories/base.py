

class BaseRepository:
    def __init__(self, connection):
        self._connection = connection

    @property
    def connection(self):
        return self._connection

