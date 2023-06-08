import { ProviderType } from '@island.is/api-catalogue/consts'
import { Provider } from '@island.is/api-catalogue/types'
import {
  GetOpenAPIRequest,
  MethodList,
  RestMetaservicesApi,
  ServiceId,
} from '../../gen/fetch/xrd-rest'
import { RestMetadataService } from './restmetadata.service'

const providerToServiceId = (
  provider: Provider,
): Omit<ServiceId, 'serviceCode'> => {
  const { instance, serviceCode, ...rest } = provider.xroadInfo
  return {
    xroadInstance: instance,
    ...rest,
  }
}

const providers = {
  'stafisl-protected': {
    name: 'Stafrænt Ísland',
    type: ProviderType.PROTECTED,
    xroadInfo: {
      instance: 'IS-DEV',
      memberClass: 'GOV',
      memberCode: '10000',
      subsystemCode: 'StafIsl-Protected',
    },
  } as Provider,
}

const serviceIds: { [key: string]: ServiceId } = {
  'StafIsl-Protected-Basic': {
    ...providerToServiceId(providers['stafisl-protected']),
    serviceCode: 'basic-v1',
  },
  'StafIsl-Protected-OptOut': {
    ...providerToServiceId(providers['stafisl-protected']),
    serviceCode: 'optOut-v1',
  },
  'StafIsl-Protected-Invalid': {
    ...providerToServiceId(providers['stafisl-protected']),
    serviceCode: 'invalid-v1',
  },
}

const mockGetOpenApi = jest
  .fn()
  .mockImplementation((req: GetOpenAPIRequest): Promise<string> => {
    const openapidocs: { [key: string]: string } = {
      'basic-v1': `openapi: '3.0.3'
info:
  version: 1.0.0
  title: Swagger Petstore Basic
  description: A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification
  termsOfService: http://swagger.io/terms/
  contact:
    name: Swagger API Team
  license:
    name: MIT
  x-category:
    - open
    - official
  x-pricing:
    - free
  x-links:
    responsibleParty: "https://my-service.island.is/responsible"
servers:
  - url: https://my-service.island.is
    description: Production path
paths:
  /pets:
    get:
      description: Returns all pets from the system that the user has access to
      responses:
        '200':
          description: A list of pets.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
`,
      'optOut-v1': `openapi: '3.0.3'
info:
  version: 1.0.0
  title: Swagger Petstore Opt Out
  description: A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification
  termsOfService: http://swagger.io/terms/
  contact:
    name: Swagger API Team
  license:
    name: MIT
  x-category:
    - open
    - official
  x-pricing:
    - free
  x-links:
    responsibleParty: "https://my-service.island.is/responsible"
  x-hide-api-catalogue: true
servers:
  - url: https://my-service.island.is
    description: Production path
paths:
  /pets:
    get:
      description: Returns all pets from the system that the user has access to
      responses:
        '200':
          description: A list of pets.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string`,
      'invalid-v1': `openapi: '3.0.3'
info:
  version: 1.0.0
  description: A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification
  termsOfService: http://swagger.io/terms/
  contact:
    name: Swagger API Team
  license:
    name: MIT
  x-category:
    - open
    - official
  x-pricing:
    - free
  x-links:
    responsibleParty: "https://my-service.island.is/responsible"
  x-hide-api-catalogue: true
servers:
  - url: https://my-service.island.is
    description: Production path
paths:
  /pets:
    get:
      description: Returns all pets from the system that the user has access to
      responses:
        '200':
          description: A list of pets.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string`,
    }

    return Promise.resolve(req.serviceCode ? openapidocs[req.serviceCode] : '')
  })

const mockListMethods = jest
  .fn()
  .mockImplementation((): Promise<MethodList> => {
    return Promise.resolve({
      service: [
        serviceIds['StafIsl-Protected-Basic'],
        serviceIds['StafIsl-Protected-OptOut'],
      ] as ServiceId[],
    })
  })

jest.mock('../../gen/fetch/xrd-rest', () => {
  return {
    RestMetaservicesApi: jest.fn().mockImplementation(() => {
      return {
        getOpenAPI: mockGetOpenApi,
        listMethods: mockListMethods,
      }
    }),
  }
})

describe('RestMetadataService', () => {
  describe('getServices', () => {
    it('should not return service which opts-out or are invalid of API Catalogue', async () => {
      // Arrange
      const dependency = new RestMetaservicesApi()
      const service = new RestMetadataService(dependency)

      // Act
      const services = await service.getServices(providers['stafisl-protected'])

      // Assert
      expect(services).toHaveLength(1)
      expect(services[0].title).toBe('Swagger Petstore Basic')
    })
  })
})
