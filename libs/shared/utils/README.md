```python
"""
Utils Module

This module provides a collection of utility functions that can be used across various applications and libraries.
"""

import logging
import os
from typing import Any, Dict, List

def setup_logging(log_level: str = 'INFO') -> None:
    """
    Sets up logging for the application.

    Parameters:
    - log_level (str): Logging level to be set. Defaults to 'INFO'.
                       Acceptable values are 'DEBUG', 'INFO', 'WARNING', 'ERROR', and 'CRITICAL'.

    Returns:
    - None
    """
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    logging.basicConfig(level=numeric_level)
    logging.debug(f"Logging set to {log_level}")

def read_file(file_path: str) -> str:
    """
    Reads the entire content of a text file.

    Parameters:
    - file_path (str): The path to the file that needs to be read.

    Returns:
    - str: The content of the file.

    Raises:
    - FileNotFoundError: If the file does not exist.
    - IOError: If there is an error reading the file.
    """
    if not os.path.exists(file_path):
        logging.error(f"File not found: {file_path}")
        raise FileNotFoundError(f"No file found at {file_path}")

    with open(file_path, 'r') as file:
        content = file.read()
        logging.debug(f"Read content from {file_path}")
        return content

def write_file(file_path: str, content: str) -> None:
    """
    Writes content to a text file. If the file already exists, it will be overwritten.

    Parameters:
    - file_path (str): The path to the file where the content should be written.
    - content (str): The content to be written in the file.

    Returns:
    - None

    Raises:
    - IOError: If there is an error writing to the file.
    """
    with open(file_path, 'w') as file:
        file.write(content)
        logging.debug(f"Wrote content to {file_path}")

def parse_csv(data: str) -> List[Dict[str, Any]]:
    """
    Parses CSV data from a string.

    Parameters:
    - data (str): CSV-formatted string.

    Returns:
    - List[Dict[str, Any]]: A list of dictionaries representing CSV rows, where keys are column headers.
    """
    import csv
    from io import StringIO

    reader = csv.DictReader(StringIO(data))
    result = [row for row in reader]
    logging.debug(f"Parsed CSV data with {len(result)} rows")
    return result
```