```python
"""
Unit Testing for the Example Module

This script contains unit tests for the functions in the example_module.py file.
"""

import unittest
from example_module import add, subtract, multiply, divide  # Import functions from the module

class TestExampleModule(unittest.TestCase):
    """
    TestCase class to test the functions in the example_module.
    """

    def test_add(self):
        """
        Test case for the add function.
        """
        self.assertEqual(add(1, 2), 3, "Adding 1 and 2 should be 3")
        self.assertEqual(add(-1, 1), 0, "Adding -1 and 1 should be 0")
        self.assertEqual(add(-1, -1), -2, "Adding -1 and -1 should be -2")

    def test_subtract(self):
        """
        Test case for the subtract function.
        """
        self.assertEqual(subtract(10, 5), 5, "Subtracting 5 from 10 should be 5")
        self.assertEqual(subtract(-1, 1), -2, "Subtracting 1 from -1 should be -2")
        self.assertEqual(subtract(-1, -1), 0, "Subtracting -1 from -1 should be 0")

    def test_multiply(self):
        """
        Test case for the multiply function.
        """
        self.assertEqual(multiply(2, 5), 10, "Multiplying 2 and 5 should be 10")
        self.assertEqual(multiply(-1, 1), -1, "Multiplying -1 and 1 should be -1")
        self.assertEqual(multiply(-1, -1), 1, "Multiplying -1 and -1 should be 1")

    def test_divide(self):
        """
        Test case for the divide function.
        """
        self.assertEqual(divide(10, 2), 5, "Dividing 10 by 2 should be 5")
        self.assertEqual(divide(-10, 2), -5, "Dividing -10 by 2 should be -5")
        self.assertEqual(divide(-10, -2), 5, "Dividing -10 by -2 should be 5")
        with self.assertRaises(ValueError, msg="Dividing by zero should raise ValueError"):
            divide(10, 0)

if __name__ == '__main__':
    unittest.main()
```