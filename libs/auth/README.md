```python
"""
Auth Module

This module provides the `Auth` class to manage user authentication.

Classes:
    - Auth: This class supports user registration and authentication.

Exception:
    - AuthError: This exception is raised for any authentication-related issues.
"""


class AuthError(Exception):
    """
    Exception raised for authentication-related errors.

    Attributes:
        message (str): Explanation of why the error occurred.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class Auth:
    """
    Auth class for managing user registrations and authentications.

    Attributes:
        users (dict): A dictionary to store user credentials with username as keys and password as values.

    Methods:
        register_user(username: str, password: str): Registers a new user with a username and password.
        authenticate_user(username: str, password: str): Authenticates a user based on provided credentials.
    """

    def __init__(self):
        """ Initialize the Auth class with an empty `users` dictionary. """
        self.users = {}

    def register_user(self, username: str, password: str) -> None:
        """
        Register a new user with a username and password.

        Parameters:
            username (str): The username for the new user.
            password (str): The password for the new user.

        Raises:
            AuthError: If the username is already registered.
        """
        if username in self.users:
            raise AuthError(f"Username {username} already registered.")
        self.users[username] = password

    def authenticate_user(self, username: str, password: str) -> bool:
        """
        Authenticate a user based on provided credentials.

        Parameters:
            username (str): The username of the user to authenticate.
            password (str): The password of the user to authenticate.

        Returns:
            bool: True if authentication succeeds, False otherwise.

        Raises:
            AuthError: If the username does not exist.
        """
        if username not in self.users:
            raise AuthError(f"Username {username} not found.")
        return self.users[username] == password
```
