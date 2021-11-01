# API Design Guide

_Draft 1 - Published 2020-08-31_ - Initial  
_Draft 2 - Published 2021-10-19_ - Changing pagination description

This is the home of the API Design Guide published by Stafrænt Ísland as a best practice guide for API development. It should help synchronize the work between developers and make working together easier. The guide covers the relevant design principles and patterns to use so the consumer experience is enjoyable and consistent throughout APIs.

This guide is under constant review and updates will be made over time as new design patterns and styles are adopted.

All feedback is welcomed and encouraged to help make the guide better so please feel free to create pull requests.

## Content

- [Once-Only](once-only.md)
- [Resource Oriented Design](resource-oriented-design.md)
  - [Design flow](resource-oriented-design.md#design-flow)
  - [Resource](resource-oriented-design.md#resources)
- [Naming Conventions](naming-conventions.md)
  - [General](naming-conventions.md#general)
  - [Resources](naming-conventions.md#resources)
  - [Fields](naming-conventions.md#fields)
- [GraphQL Naming Conventions](graphql-naming-conventions.md)
  - [Case styles](graphql-naming-conventions.md#case-styles)
  - [Input objects naming conventions](graphql-naming-conventions.md#input-objects-naming-conventions)
  - [Query naming conventions](graphql-naming-conventions.md#query-naming-conventions)
  - [Mutation naming conventions](graphql-naming-conventions.md#mutation-naming-conventions)
  - [Integrating naming conventions into shared api](graphql-naming-conventions.md#integrating-naming-conventions-into-shared-api)
- [Data Definitions](data-definitions.md)
  - [Text encoding](data-definitions.md#text-encoding)
  - [JSON](data-definitions.md#json)
  - [National identifier](data-definitions.md#national-identifier)
  - [Language and currency](data-definitions.md#language-and-currency)
  - [Date and time](data-definitions.md#date-and-time)
  - [Timestamp data](data-definitions.md#timestamp-data)
- [Data transfer objects](data-transfer-objects.md)
- [Pagination](pagination.md)
  - [PageInfo](pagination.md#pageinfo)
  - [Pagination Query parameters](pagination.md#pagination-query-parameters)
  - [Monorepo library](pagination.md#monorepo-library)
- [Methods](methods.md)
  - [Methods mapping to HTTP verbs](methods.md#methods-mapping-to-http-verbs)
  - [Custom methods](methods.md#custom-methods)
- [HTTP Status Codes](http-status-codes.md)
  - [General](http-status-codes.md#general)
  - [GET](http-status-codes.md#get)
  - [POST](http-status-codes.md#post)
  - [PUT](http-status-codes.md#put)
  - [PATCH](http-status-codes.md#patch)
  - [DELETE](http-status-codes.md#delete)
- [Errors](errors.md)
  - [Response Body](errors.md#response-body)
- [Documentation](documentation.md)
  - [Describe error handling](documentation.md#describe-error-handling)
  - [Provide feedback mechanism](documentation.md#provide-feedback-mechanism)
  - [Example](documentation.md#example)
  - [Setup example](documentation.md#setup-example)
- [Versioning](versioning.md)
  - [Version changes](versioning.md#version-changes)
  - [URLs](versioning.md#urls)
  - [Increment version numbers](versioning.md#increment-version-numbers)
  - [Deprecating API versions](versioning.md#deprecating-api-versions)
- [Security](security.md)
- [Environments](environments.md)
  - [Development](environments.md#development-environment)
  - [Test](environments.md#test-environment-for-providers-of-an-api)
  - [Sandbox](environments.md#sandbox-environment-for-consumers-of-an-api)
  - [Production](environments.md#production-environment)
- [Example Service](example.md)
