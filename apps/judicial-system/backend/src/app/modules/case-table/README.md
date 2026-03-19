# Case Table Module

This module contains the logic for generating case tables, which are used in various parts of the judicial system application to display lists of cases with relevant information. The module also handles searching and associating cases with case tables.

The main components of this module include:

- **CaseTableTypes**: Definitions of the different types of case tables that exist in the application, along with the columns they contain.
- **CaseTableCellGenerators**: A collection of column definitions, each specifying how to generate the content for each cell in the case tables based on the case data.
- **CaseTableWhereOptions**: Functions that generate the necessary database query options to determine which cases belong to which tables, based on the user's role and the case data.
- **CaseTableService**: The service responsible for fetching cases, searching and determining which case tables they belong to, and generating the data for those tables.

## General Principles

The module design follows certain principles to ensure efficient data fetching and clear separation of concerns. Modifications to the case tables should adhere to these principles:

- Each case table type has a corresponding set of columns defined in `CaseTableTypes`.
- Each column has a corresponding cell generator in `CaseTableCellGenerators` that defines how to extract and format the data for that column from a case. Each generator should only include entities and attributes that it needs to generate its cell value, no more.
- The `CaseTableWhereOptions` functions define the database queries needed to determine which cases belong in which tables, based on the user's role and the case data. These functions should be optimized to include only the necessary joins and conditions to efficiently determine table membership. Specifically, they should not include unnecessary attributes or related entities that are not needed for determining table membership. Each function should be focused on the specific criteria for that table type and role, and should avoid including data that is only needed for cell generation. Optionally, the where options can specify a function to split cases into multiple rows if needed (e.g. one row per defendant).
- The `CaseTableService` uses the above components to fetch and search cases, determine their table memberships, and generate the data for display in the case tables. It should ensure that the database queries are efficient and that the cell generators are only given the data they need to generate their values. The service handles additional logic such as determining which cases belong to the calling user, determining the appropriate row click actions and context menus. In the future, the service should also handle any necessary pagination, sorting, and filtering of cases for display in the tables.
