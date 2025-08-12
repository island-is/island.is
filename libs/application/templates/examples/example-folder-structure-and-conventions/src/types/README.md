# Types

This folder is for all the types, interfaces and enums used by the application.

This folder should at minimum have a index.ts that either has all the types or re-exports the types from the other files in the folder.
Interfaces should be stored in interfaces.ts and enums should be stored in enums.ts.

Other than the index.ts file, the number of files and organization of the files is up to the developer.

Files should follow camelCase naming.

Types, Interfaces and Enums should follow PascalCase naming.

## Example

|-- types/
|-- |-- index.ts (re-exports from other files)
|-- |-- types1.ts
|-- |-- types2.ts
|-- |-- interfaces.ts
|-- |-- enums.ts
