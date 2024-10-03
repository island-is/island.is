```python
"""
Module: Shared

This module provides a utility function for calculating GCD of two numbers.
It uses the Euclidean algorithm to compute the greatest common divisor.
"""

def gcd(a: int, b: int) -> int:
    """
    Calculate the greatest common divisor (GCD) of two integers using the Euclidean algorithm.

    Parameters:
    - a (int): The first integer.
    - b (int): The second integer.

    Returns:
    - int: The greatest common divisor of a and b.

    Usage:
    >>> gcd(48, 18)
    6

    Raises:
    - ValueError: If either a or b is negative.
    """
    if a < 0 or b < 0:
        raise ValueError("Numbers must be non-negative")

    while b != 0:
        a, b = b, a % b

    return a
```
