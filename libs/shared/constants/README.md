```plaintext
# Constants

"""
This module contains constants that are shared across various applications
and libraries. These constants are useful for managing common configurations
such as locales and date variables across the entire codebase.

Usage:
    Import this module in any library or application where you need to access
    these shared constants. This helps in maintaining consistency and reduces
    code duplication by centralizing common constants.

Example:
    from constants import LOCALE, DATE_FORMAT

    def display_date(date):
        return date.strftime(DATE_FORMAT)

    print(display_date(datetime.now()))
"""

# Add shared constants below, for instance:
# LOCALE = 'en_US'
# DATE_FORMAT = '%Y-%m-%d'

# Please replace example constants below with your actual constants
LOCALE = 'en_US'  # Default locale for the application
DATE_FORMAT = '%Y-%m-%d'  # Default date format used in the application
```
