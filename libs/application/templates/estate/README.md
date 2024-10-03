```python
class Estate:
    """
    A class to represent an estate. The estate includes properties like name,
    address, area, value, and owner. It provides methods to update several of these
    attributes and to calculate the cost per square meter.
    """

    def __init__(self, name, address, area, value, owner):
        """
        Initializes a new instance of Estate.

        :param name: The name of the estate.
        :type name: str
        :param address: The address of the estate.
        :type address: str
        :param area: The area of the estate in square meters.
        :type area: float
        :param value: The value of the estate in the same currency unit.
        :type value: float
        :param owner: The owner of the estate.
        :type owner: str
        """
        self.name = name
        self.address = address
        self.area = area
        self.value = value
        self.owner = owner

    def update_address(self, new_address):
        """
        Updates the address of the estate.

        :param new_address: The new address of the estate.
        :type new_address: str
        """
        self.address = new_address

    def update_value(self, new_value):
        """
        Updates the value of the estate.

        :param new_value: The new monetary value of the estate.
        :type new_value: float
        """
        self.value = new_value

    def update_owner(self, new_owner):
        """
        Updates the owner of the estate.

        :param new_owner: The new owner of the estate.
        :type new_owner: str
        """
        self.owner = new_owner

    def cost_per_square_meter(self):
        """
        Calculates the cost per square meter of the estate.

        :return: The cost per square meter as a float.
        :rtype: float
        :raises ValueError: If the estate area is zero to prevent division by zero.
        """
        if self.area == 0:
            raise ValueError("Area of estate cannot be zero.")
        return self.value / self.area
```
