# Documentation

API documentation should be targeted towards the developer that will consume the API. A good documentation is one of the single most important qualities of an API. It makes it much easier for other developers to use services and significantly reduces implementation time for API consumers. The API developer is responsible for keeping the documentation up to date.

To help with keeping documentation up to date consider using automatic generation tools that during build time can, for example, gather comments in predefined syntax and generate the [Open API Specification](https://swagger.io/specification/) (OAS), this means that the OAS lives bundled with the code and should be easier for developers to maintain.

**Note** - To be able to register a **REST** service to _Viskuausan_ the service **MUST** provide an **OPENAPI 3** service description.

The following fields are required for services to be automatically imported to _Viskuausan_:

- info
  - description — short but proper description of the API.
  - version — to distinguish API versions following [semantic versioning](https://semver.org/) specification.
  - title — descriptive name of the API.
  - contact — information on who to contact about an issue with the service.
    - name — of the person or a department.
    - email — fully qualified email.
  - x-category — What kind of data does this service work with.
    - Possible values: `open`, `official`, `personal`, `health`, `financial`.
  - x-pricing — Cost of using this service.
    - Possible values: `free`, `paid`.
  - x-links — Links regarding the service.
    - responsibleParty — a fully qualified url to an online page containing information about the responsible party/owner of the service.
    - documentation — (_Optional_) a fully qualified url to the API documentation page.
    - bugReport (_Optional_) — a fully qualified url to an online page or form a consumer can report bugs about the service.
    - featureRequest (_Optional_) — a fully qualified url to an online page or form a consumer can ask for a new feature in api service.

Example can be found [here](documentation.md#example).

## Describe error handling

Provide information on which HTTP status codes a client consuming your service can expect the API to return, and provide information on application defined errors and how the errors are presented to clients. See [Errors](errors.md) for further details.

## Provide feedback mechanism

Provide users with a way to comment on your documentation. This will help with finding concepts that need further explanation and keeping the documentation up to date.

The field x-links in the OpenAPI schema provides a way to include paths where consumers can provide feedback on the API.

## Example

```text
openapi: 3.0.3
servers:
  - url: https://development.my-service.island.is
    description: Development server
  - url: https://staging.my-service.island.is
    description: Staging server
  - url: https://production.my-service.island.is
    description: Production server
info:
  description: |-
    Provides access to an example service that retrieves individuals
  version: 0.0.1
  title: Example service
  termsOfService: ""
  contact:
    name: Digital Iceland
    url: https://stafraent.island.is/
    email: stafraentisland@fjr.is
  license:
    name: MIT
    url: "https://opensource.org/licenses/MIT"
  x-pricing:
    - free
  x-category:
    - personal
    - official
  x-links:
    documentation: "https://docs.my-service.island.is"
    responsibleParty: "https://my-service.island.is/responsible"
    bugReport: "https://github.com/island-is/handbook/issues/new?assignees=&labels=&template=bug_report.md"
    featureRequest: "https://github.com/island-is/handbook/issues/new?assignees=&labels=&template=feature_request.md"
paths:
  /individuals:
    get:
      description: |
        Returns all individuals registered
      operationId: getIndividuals
      parameters:
        - name: dateOfBirth
          in: query
          description: Find all individuals born after set date
          required: false
          schema:
            type: string
            format: date
      responses:
        "200":
          description: |
            Returns an array of individuals, either it returns all individuals or individuals born after a specific date
          content:
            application/json:
              schema:
                type: object
                properties:
                  individuals:
                    type: array
                    items:
                      $ref : "#/components/schemas/Individual"
        "400":
          $ref: "#/components/responses/BadRequest"
        "500":
          $ref: "#/components/responses/InternalServerError"
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    $ref: "#/components/schemas/Error"
  /individuals/{id}:
    get:
      description: |
        Returns individual based on a single ID
      operationId: getIndividual
      parameters:
        - name: id
          in: path
          description: UUID of an individual
          required: true
          schema:
            type: string
            format: UUID
      responses:
        "200":
          description: |
            Returns an individual with a specific id
          content:
            application/json:
              schema:
                type: object
                properties:
                  individuals:
                    type: array
                    items:
                      $ref : "#/components/schemas/Individual"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"
        "500":
          $ref: "#/components/responses/BadRequest"
components:
  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    NotFound:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    InternalServerError:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
  schemas:
    Individual:
      type: object
      properties:
        id:
          type: string
          description: Unique UUID
          format: UUID
        nationalId:
          type: string
          minLength: 12
          maxLength: 12
          pattern: '^\d{12}$'
          description: National security number
        firstName:
          type: string
          minLength: 1
          maxLength: 250
          description: First name and middle name
        lastName:
          type: string
          minLength: 1
          maxLength: 250
          description: Last name
        dateOfBirth:
          type: string
          format: date-time
          description: UTC date of birth
      example:
        id: "BA84DAF1-DE55-40A8-BF35-8A76C7F936F6"
        nationalId: "160108117573"
        firstName: "Quyn G."
        lastName: "Rice"
        dateOfBirth: "2019-03-29T18:00:58.000Z"
        address: "377-8970 Vitae Rd."
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: integer
        message:
          type: string
        errors:
          type: array
          items:
            $ref: "#/components/schemas/ErrorDetail"
      example:
        code: 400
        message: "Bad request"
        errors:
          - code: 87
            message: "Parameter is incorrectly formatted"
            help: "https://www.moa.is/awesome/documetation/devices"
            trackingId: "5d17a8ada52a2327f02c6a1a"
            param: "deviceId"
          - code: 85
            message: Parameter missing
            help: 'https://www.moa.is/awesome/documetation/devices'
    ErrorDetail:
      type: object
      required:
        - message
      properties:
        code:
          type: integer
        message:
          type: string
        help:
          type: string
        trackingId:
          type: string
        param:
          type: string
```
