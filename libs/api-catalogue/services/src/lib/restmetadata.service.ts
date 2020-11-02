import {
  providerToString,
  Provider,
  Service,
  OpenApi,
  XroadIdentifier,
} from '@island.is/api-catalogue/types'
import { Injectable } from '@nestjs/common'
import { RestMetaservicesApi } from '../../gen/fetch/xrd-rest'
import { logger } from '@island.is/logging'
import YamlParser from 'js-yaml'
import union from 'lodash/union'
import {
  AccessCategory,
  ProviderType,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { serviceIdSort, exceptionHandler } from './utils'
import { uuid } from 'uuidv4'

@Injectable()
export class RestMetadataService {
  constructor(private readonly xrdRestMetaservice: RestMetaservicesApi) {}

  /**
   * Gets list of all REST services with an OpenAPI document
   * from an Service Provider (X-Road Subsystem)
   * @param provider
   */
  async getServices(provider: Provider): Promise<Array<Service>> {
    logger.info(`Getting services for ${providerToString(provider)}`)
    const services: Array<Service> = []
    const serviceMap = await this.getServiceCodes(provider)

    for (const [_, value] of serviceMap) {
      const sorted = value.sort(serviceIdSort)

      const service: Service = {
        id: uuid().split('-').join(''),
        name: '',
        owner: '',
        description: '',
        pricing: [],
        data: [],
        access: [AccessCategory.XROAD],
        type: [TypeCategory.REST],
        xroadIdentifier: [],
      }

      if (provider.type === ProviderType.PUBLIC) {
        service.access.push(AccessCategory.APIGW)
      }

      // Get the OpenApi for each service to aggregate info
      for (let i = 0; i < sorted.length; i++) {
        const spec = await this.getOpenApi(sorted[i])

        if (spec) {
          // The list is sorted for the latest service version to be the last element
          // so name, owner and description will be from the latest version.
          service.name = spec.info.title
          service.owner = spec.info.contact?.name || provider.subsystemCode // ToDo: Maybe update to use provider.memberCode to look up the name
          service.description = spec.info.description ?? ''
          service.data = union(service.data, spec.info.x_category)
          service.pricing = union(service.pricing, spec.info.x_pricing)
          service.xroadIdentifier.push(sorted[i])
        } else {
          logger.warn(
            `OpenAPI not found for service code ${sorted[i].memberCode}/${sorted[i].subsystemCode}/${sorted[i].serviceCode}`,
          )
        }
      }

      if (service.name) services.push(service)
    }

    logger.info(
      `Found ${services.length} services for ${providerToString(provider)}`,
    )

    return services
  }

  /**
   * Gets service OpenAPI from X-Road.
   * @param xroadIdentifier Object identifying the service in X-Road
   * @returns OpenAPI object if spec is found, otherwise null
   */
  async getOpenApi(
    xroadIdentifier: XroadIdentifier,
  ): Promise<OpenApi | undefined> {
    return YamlParser.safeLoad(
      await this.getOpenApiString(xroadIdentifier),
    ) as OpenApi
  }

  /**
   * Returns the OpenApi YAML or JSON string from X-Road environment
   * @param xroadIdentifier
   */
  async getOpenApiString(xroadIdentifier: XroadIdentifier): Promise<string> {
    try {
      // We have this in a try/catch as REST services can be manually
      // registered in X-Road, meaning they won't have an OpenAPI which
      // causes X-Road to return Internal Server Error causing exception.
      // This can be fixed using the REST AdminAPI to check the REST type
      // of the service before calling this.
      return await this.xrdRestMetaservice.getOpenAPI({
        xRoadInstance: xroadIdentifier.instance,
        memberClass: xroadIdentifier.memberClass,
        memberCode: xroadIdentifier.memberCode,
        subsystemCode: xroadIdentifier.subsystemCode,
        serviceCode: xroadIdentifier.serviceCode,
      })
    } catch (err) {
      exceptionHandler(err)
    }

    return ''
  }

  private async getServiceCodes(
    provider: Provider,
  ): Promise<Map<string, Array<XroadIdentifier>>> {
    const serviceMap = new Map<string, Array<XroadIdentifier>>()
    const xrdServices = await this.xrdRestMetaservice.listMethods({
      xRoadInstance: provider.xroadInstance,
      memberClass: provider.memberClass,
      memberCode: provider.memberCode,
      subsystemCode: provider.subsystemCode,
    })

    logger.debug(
      `Found ${
        xrdServices?.service?.length
      } service codes for ${providerToString(provider)}`,
    )

    xrdServices?.service?.forEach((item) => {
      // Validate the properties are provided that we need
      if (
        item &&
        item.serviceCode &&
        item.xroadInstance &&
        item.memberCode &&
        item.memberClass &&
        item.subsystemCode
      ) {
        const serviceCode = item.serviceCode.split('-')[0]
        const mappedItem: XroadIdentifier = {
          instance: item.xroadInstance,
          memberClass: item.memberClass,
          memberCode: item.memberCode,
          subsystemCode: item.subsystemCode,
          serviceCode: item.serviceCode,
        }

        const map = serviceMap.get(serviceCode)

        if (map) {
          map.push(mappedItem)
        } else {
          serviceMap.set(serviceCode, [mappedItem])
        }
      }
    })

    return serviceMap
  }
}
