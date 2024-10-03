```python
# Icelandic Names Registry Types

"""
This module contains data types for representing information from the Icelandic Names Registry.
The registry includes details of male and female names, and names in historical context. 
The models provided below can be used to parse and validate the data from the registry.
"""

from pydantic import BaseModel
from typing import List, Optional

class NameDetail(BaseModel):
    """
    Represents detailed information about a specific name.

    Attributes:
        name (str): The name as recorded in the registry.
        approved (bool): Indicates if the name is officially approved.
        status (str): The registration status of the name.
        meaning (Optional[str]): The meaning of the name, if available.
        usage (Optional[str]): Information about the usage of the name.
    """
    name: str
    approved: bool
    status: str
    meaning: Optional[str] = None
    usage: Optional[str] = None


class NamesRegistry(BaseModel):
    """
    Represents the complete registry of names.

    Attributes:
        male_names (List[NameDetail]): A list of male names and their details.
        female_names (List[NameDetail]): A list of female names and their details.
        historical_names (List[NameDetail]): A list of names categorized as historical and their details.
    """
    male_names: List[NameDetail]
    female_names: List[NameDetail]
    historical_names: List[NameDetail]
```