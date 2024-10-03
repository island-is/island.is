```python
"""
Nest Modules

This module demonstrates the nested module pattern in Python by defining functions and classes
that return specific greeting messages from different levels of the module hierarchy.
"""

def hello_from_main():
    """
    Return a greeting message from the main module.

    Returns:
        str: A greeting message from the main module.
    """
    return "Hello from the main module!"

class OuterModule:
    """
    Represents an outer module which contains an inner module and provides specific functionality.
    """

    @staticmethod
    def hello_from_outer():
        """
        Return a greeting message from the outer module.

        Returns:
            str: A greeting message from the outer module.
        """
        return "Hello from the outer module!"

    class InnerModule:
        """
        Represents an inner module within the outer module, demonstrating a nested class structure.
        """

        @staticmethod
        def hello_from_inner():
            """
            Return a greeting message from the inner module.

            Returns:
                str: A greeting message from the inner module.
            """
            return "Hello from the inner module!"
```
