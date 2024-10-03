```python
"""
Nest Modules

This module demonstrates the nested module pattern in Python.
"""

def hello_from_main():
    """
    A simple function to demonstrate the primary module's greeting.

    Returns:
        str: A greeting message from the main module.
    """
    return "Hello from the main module!"


class OuterModule:
    """
    A class representing an outer module which contains a nested module.
    """

    @staticmethod
    def hello_from_outer():
        """
        A simple function to demonstrate the outer module's greeting.

        Returns:
            str: A greeting message from the outer module.
        """
        return "Hello from the outer module!"

    class InnerModule:
        """
        A class representing an inner module within the outer module.
        """

        @staticmethod
        def hello_from_inner():
            """
            A simple function to demonstrate the inner module's greeting.

            Returns:
                str: A greeting message from the inner module.
            """
            return "Hello from the inner module!"
```