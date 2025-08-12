# example-folder-structure-and-conventions

This template is an example of how to structure an application, what the folder structure should look like and what the coding conventions are.

## Coding conventions

The aim is to have all applications to be coded in a similar way, so that every developer that is familiar with the application system can open any application and everything is consistent and feels familiar.

- Reduce the amount of custom components to a minimum.
- Reduce the use of the "as" and "any" keywords as much as possible. Both of those keywords are tricking the linter to accept code that would otherwise throw errors and might cause hard to trace bugs.
- Try to use the `getValueViaPath` function to access the answers of the application. It makes accessing nested values easier and the code more readable. Note that this function is generic and a type can be provided to make sure the type of the value is correct E.g:

`getValueViaPath<string>(application.answers, 'some.nested.value', 'optional fallback')`

- Don't use fake steps, stepper should only be showing steps of the current form. On the first step in the main form, there shouldn't be a back button or the illusion that you can go back to the prerequsites step.

## Folder structure

|-- assets/--------------------------------# optional folder for assets like images, icons, etc. \
|
|-- components/----------------------------# optional folder for React components that are used by custom components.\
|
|-- dataProviders/-------------------------# folder for data providers.\
|
|-- fields/--------------------------------# optional folder for custom components if the application needs any.\
|-- |-- index.ts---------------------------# Exports all fields from the folder.\
|-- |-- myCustomComponent/-----------------# Folder for a custom component, camelCase.\
|-- |-- |-- MyCustomComponent.tsx----------# React component file, PascalCase.\
|-- |-- |-- MyCustomComponent.css.ts-------# CSS file, PascalCase.\
|
|-- forms/---------------------------------# folder for forms. More about form folder structure in the form folder README.\
|-- |-- prerequisitesForm/
|-- |-- mainForm/
|-- |-- conclusionForm/--------------------# More forms if needed\
|
|-- graphql/-------------------------------# optional folder for graphql queries and mutations.\
|
|-- lib/-----------------------------------# folder for data schema, messages, and the main template file.\
|-- |-- dataSchema.ts----------------------# Validation for the application.\
|-- |-- mainTemplate.ts--------------------# Main template file. State machine for the application, mapUsersToRole and more\
|-- |-- messages.ts------------------------# File for all text that appears on the screen, synced with Contentful.\
|-- |-- messages/--------------------------# optional folder for messages if there is a need to have the messages more organized.\
|
|-- shared/--------------------------------# optional folder for code that might be needed in the template-api-modules or other places outside the template.\
|
|-- utils/---------------------------------# folder for utility functions, constants, enums and types.\
|-- |-- constants.ts-----------------------# Constants for the application.\
|-- |-- enums.ts---------------------------# Enums for the application.\
|-- |-- types.ts---------------------------# Types for the application.\
|-- |-- helperFunctions.ts-----------------# Helper functions for the application, this can be many files.\
