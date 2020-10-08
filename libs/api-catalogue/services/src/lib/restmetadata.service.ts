import {
  Provider,
  Service,
  OpenApi,
  XroadIdentifier,
} from '@island.is/api-catalogue/types'
import { Injectable } from '@nestjs/common'
import { RestMetaservicesApi } from '../../gen/fetch-xrd-rest'
import { logger } from '@island.is/logging'
import YamlParser from 'js-yaml'
import * as _ from 'lodash'
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
    logger.info(
      `Getting services for ${provider.memberCode}/${provider.subsystemCode}`,
    )
    let services: Array<Service> = []
    let serviceMap = await this.getServiceCodes(provider)

    for (const [key, value] of serviceMap) {
      const sorted = value.sort(serviceIdSort)

      let service: Service = {
        id: uuid()
          .split('-')
          .join(''),
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
          service.owner = spec.info.contact?.name
          service.description = spec.info.description
          service.data = _.union(service.data, spec.info.x_category)
          service.pricing = _.union(service.pricing, spec.info.x_pricing)
          service.xroadIdentifier.push(sorted[i])
        } else {
          logger.warn(
            `OpenAPI not found for service code ${sorted[i].memberCode}/${sorted[i].subsystemCode}/${sorted[i].serviceCode}`,
          )
        }
      }

      if (service.name) services.push(service)
    }

    return services
  }

  /**
   * Gets service OpenAPI from X-Road.
   * @param xroadIdentifier Object identifying the service in X-Road
   * @returns OpenAPI object if spec is found, otherwise null
   */
  async getOpenApi(xroadIdentifier: XroadIdentifier): Promise<OpenApi> {
    try {
      return YamlParser.safeLoad(
        await this.getOpenApiString(xroadIdentifier),
      ) as OpenApi
    } catch (err) {
      exceptionHandler(err)
    }

    return null
  }

  /**
   * Returns the OpenApi YAML string
   * @param xroadIdentifier
   */
  async getOpenApiString(xroadIdentifier: XroadIdentifier): Promise<string> {
    try {
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
    let serviceMap = new Map<string, Array<XroadIdentifier>>()

    try {
      const xrdServices = await this.xrdRestMetaservice.listMethods({
        xRoadInstance: provider.xroadInstance,
        memberClass: provider.memberClass,
        memberCode: provider.memberCode,
        subsystemCode: provider.subsystemCode,
      })

      logger.debug(`Found ${xrdServices?.service?.length} service codes`)

      xrdServices.service.forEach((item) => {
        const serviceCode = item.serviceCode.split('-')[0]
        const mappedItem: XroadIdentifier = {
          instance: item.xroadInstance,
          memberClass: item.memberClass,
          memberCode: item.memberCode,
          subsystemCode: item.subsystemCode,
          serviceCode: item.serviceCode,
        }

        if (serviceMap.has(serviceCode)) {
          serviceMap.get(serviceCode).push(mappedItem)
        } else {
          serviceMap.set(serviceCode, [mappedItem])
        }
      })
    } catch (err) {
      exceptionHandler(err)
    }

    return serviceMap
  }
}
