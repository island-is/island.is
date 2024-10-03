```python
"""
Module: Application

This module serves as the main entry point for executing various operations related to handling user data.
The functions provided cover operations like user authentication, data loading, and report generation.

Classes:
    User
    Database

Functions:
    authenticate_user
    load_user_data
    generate_report

Exceptions:
    UserNotFoundError
    InvalidCredentialsError

TODO:
    Implement logging mechanism for each function.
    Add support for multiple databases.
    Enhance security measures for authentication.
"""

class User:
    """
    A class used to represent a User in the system.

    Attributes
    ----------
    username : str
        The user's username.
    password : str
        The user's password.

    Methods
    -------
    __init__(self, username, password):
        Initializes User with a username and password.
    """

    def __init__(self, username, password):
        """
        Initializes a User object with a username and password.

        Parameters
        ----------
        username : str
            The username of the user.
        password : str
            The password associated with the user.
        """
        self.username = username
        self.password = password


class Database:
    """
    A class used to interact with the User database.

    This class simulates interactions, such as fetching user data.

    Methods
    -------
    check_user_in_db(username, password):
        Check if a user exists in the database with the matching credentials.
    """

    def check_user_in_db(self, username, password):
        """
        Simulates checking if a user exists in the database with matching credentials.

        Parameters
        ----------
        username : str
            The username to be verified.
        password : str
            The password to be checked against the username.

        Returns
        -------
        bool
            True if user is found and credentials match, False otherwise.
        """
        return True  # Simulated for example purposes.


class UserNotFoundError(Exception):
    """
    Exception raised for errors in the retrieval of a user.

    Attributes
    ----------
    message : str
        Explanation of the error.
    """
    def __init__(self, message="User not found"):
        """
        Constructs the UserNotFoundError with an optional message.

        Parameters
        ----------
        message : str, optional
            The error message to be displayed (default is "User not found").
        """
        self.message = message
        super().__init__(self.message)


class InvalidCredentialsError(Exception):
    """
    Exception raised for invalid credentials during authentication.

    Attributes
    ----------
    message : str
        Explanation of the error.
    """
    def __init__(self, message="Invalid username or password"):
        """
        Constructs the InvalidCredentialsError with an optional message.

        Parameters
        ----------
        message : str, optional
            The error message to be displayed (default is "Invalid username or password").
        """
        self.message = message
        super().__init__(self.message)


def authenticate_user(username, password):
    """
    Authenticates a user based on username and password.

    Parameters
    ----------
    username : str
        The username of the user trying to log in.
    password : str
        The password associated with the username.

    Returns
    -------
    bool
        True if authentication is successful, raises InvalidCredentialsError otherwise.

    Raises
    ------
    InvalidCredentialsError
        If the username or password is incorrect.
    """
    database = Database()
    if not database.check_user_in_db(username, password):
        raise InvalidCredentialsError()
    return True


def load_user_data(user_id):
    """
    Loads user data from the database using a user ID.

    Parameters
    ----------
    user_id : str
        The ID of the user whose data is to be loaded.

    Returns
    -------
    dict
        A dictionary containing user information.

    Raises
    ------
    UserNotFoundError
        If the user with the given ID cannot be found.
    """
    user_data = {"123": {"name": "Alice", "email": "alice@example.com"}}  # Simulated data
    if user_id not in user_data:
        raise UserNotFoundError(f"User with ID {user_id} not found.")
    return user_data[user_id]


def generate_report(user_data):
    """
    Generates a formatted report of the user data.

    Parameters
    ----------
    user_data : dict
        A dictionary containing the user's data that needs to be included in the report.

    Returns
    -------
    str
        A formatted string report of the user's data.
    """
    report = f"User Report:\nName: {user_data['name']}\nEmail: {user_data['email']}\n"
    return report
```
