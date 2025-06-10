# The fields folder

This folder contains all custom components that are used by the application.

## Organisation

- All custom components should be in a folder that holds all files for that component. This includes the .tsx file, possibly a .css.ts file and maybe others.
  The folders should be named like the component, but with the first letter in lowercase (camelCase), and then the .tsx and .css.ts files should be capitalized (PascalCase).
- The folder should have an index.ts file that re-exports all the components.
- The index.ts file in the /src folder should then re-export the components in the /fields folder for the template loader.

## Useage of custom components

Before creating a custom component, you should:

1. Try to use the shared components, `buildTextField`, `buildCheckboxField`, `buildSelectField`, `buildFileUploadField` and so on. This is most preferable to make the look and feel of the application more consistent and uniform.
2. If the shared components almost fullfill your needs but you need something more, consider consulting with the designer of the application and try to adjust the design to the built in components.
3. If the design can not be adjusted to the built in components, then consult Norda if a shared component can possibly be adjusted or expanded to fulfill your needs.
4. Is there another application that has made a similar custom component before? If so, then it should be a shared component.
5. If you still need a new component, ask yourself if this is a component that another application might also need in the future. If so make the new component shared.
6. Make a custom component if none of the above apply.

## Example

|-- fields/
|-- |-- index.ts
|-- |-- myCustomComponent/
|-- |-- |-- MyCustomComponent.tsx
|-- |-- |-- MyCustomComponent.css.ts
