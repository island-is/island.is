```python
"""
`clients.py` Module
-------------------

This module defines the `Clients` class which manages a collection of `Client` instances.
The class provides functionalities to add, remove, and obtain specific clients.

Classes:
    Client: Represents a single client with a unique id and name.
    Clients: Manages a collection of `Client` instances.

Usage Example:
    client_manager = Clients()
    client_manager.add_client("C101", "Alice")
    client = client_manager.get_client("C101")
    # Do something with the client
"""

class Client:
    """
    Represents a single client identified by a unique id and a name.

    Attributes:
        id (str): Unique identifier for the client.
        name (str): Name of the client.
    """

    def __init__(self, id, name):
        """
        Initializes a new `Client` instance.

        Args:
            id (str): The unique identifier for the client.
            name (str): The name of the client.
        """
        self.id = id
        self.name = name


class Clients:
    """
    Manages a collection of `Client` instances.

    This class provides functionalities to add, remove, and retrieve specific clients from the collection.

    Attributes:
        _clients (dict): A dictionary to store clients with client id as keys and `Client` objects as values.
    """

    def __init__(self):
        """
        Initializes the `Clients` management class with an empty collection of clients.
        """
        self._clients = {}

    def add_client(self, client_id, client_name):
        """
        Adds a new `Client` to the collection.

        If a client with the same id already exists, it updates the client's name.

        Args:
            client_id (str): The unique identifier for the client.
            client_name (str): The name of the client.
        """
        self._clients[client_id] = Client(client_id, client_name)

    def remove_client(self, client_id):
        """
        Removes a `Client` from the collection by id.

        If the client id is not found, the method does nothing.

        Args:
            client_id (str): The unique identifier for the client to be removed.
        """
        if client_id in self._clients:
            del self._clients[client_id]

    def get_client(self, client_id):
        """
        Retrieves a `Client` from the collection by id.

        Args:
            client_id (str): The unique identifier for the client to be retrieved.

        Returns:
            Client: The `Client` instance associated with the given id, or None if not found.
        """
        return self._clients.get(client_id)
```