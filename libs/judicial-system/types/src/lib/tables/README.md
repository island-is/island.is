# Case Tables

This library contains case table declarations for the Judicial System. A case table (see `caseTable.ts`) has a title and a list of column declarations. A column (see `caseTableColumn.ts`) has a title. Case tables are organized into case table groups (see `caseTableGroup.ts`).

## Case Table Columns

In `caseTableColumn.ts` you will find the available table column declarations. A table column determines how the corresponding table row cells are populated with data (in the backend) and how they are rendered (in the frontend). It also determines how the table column is sorted (in the frontend).

Populating the table row cells with data is handled in the `CaseTableModule` module in the backend.

Rendering and sorting are handled in the `CaseTable` component in the frontend.

Usually, you should be able to use the existing table column declarations. If you need a new one, then you can add a declaration in `caseTableColumn.ts` and add the relevant implementation for table row cell population, rendering and sorting.

## Case Table

In `caseTable.ts` you will find the available case table declarations. Generally, a table is associated with a specific user type. When adding a new case table declaration, you should follow the pattern already used for existing case tables by adding a new case table type, a new list of case table columns and a case table constant. You should also add a mapping from the "case table route" to the case table type. More on case table routes below.

## Case Table Groups

In `caseTableGroup.ts` you will find the available case table group declarations. A case table group is a collection of case tables, grouped into sections. A case table croup is associated with a given user type. The case table type and case table route determine which table to open and its route in the frontend.
