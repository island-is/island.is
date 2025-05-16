# Template-api-module for example-folder-structure-and-conventions

This is a template-api-module for the example-folder-structure-and-conventions application.

## The module

The module is a standard NestJS module that is used to provide the API for the application.

It should:

- Import other modules that the application needs
- Import a service that extends the BaseTemplateApiService as a provider
- Export the service so it can be used in the application

## The service

The service is a class that extends the BaseTemplateApiService.

It should:

- Have a constructor that injects the necessary services (that the module has imported)
- Have functions that the application template needs, like submitting, fetching data, etc.
