import { Provider, Service, OpenApi } from '@island.is/api-catalogue/types'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RestMetaservicesApi, ServiceId } from '../../gen/fetch-xrd-rest'
import { logger } from '@island.is/logging'
import YamlParser from 'js-yaml'
import * as _ from 'lodash'
import {
  AccessCategory,
  ProviderType,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { serviceIdSort } from './utils'

@Injectable()
export class RestMetadataService {
  constructor(private readonly xrdRestMetaservice: RestMetaservicesApi) {}

  /**
   * Gets list of all REST services with an OpenAPI document
   * from an Service Provider (X-Road Subsystem)
   * @param provider
   */
  async getServices(provider: Provider): Promise<Array<Service>> {
    logger.debug(
      `Getting services for ${provider.memberCode}/${provider.subsystemCode}`,
    )
    let services: Array<Service> = []

    const xrdServices = await this.xrdRestMetaservice.listMethods({
      xRoadInstance: provider.xroadInstance,
      memberClass: provider.memberClass,
      memberCode: provider.memberCode,
      subsystemCode: provider.subsystemCode,
    })

    logger.debug(`Found ${xrdServices.service.length} services`)

    let serviceMap = new Map<string, Array<ServiceId>>()

    xrdServices.service.forEach((item) => {
      const serviceCode = item.serviceCode.split('-')[0]

      if (serviceMap.has(serviceCode)) {
        serviceMap.get(serviceCode).push(item)
      } else {
        serviceMap.set(serviceCode, [item])
      }
    })

    for (let [key, value] of serviceMap) {
      const sorted = value.sort(serviceIdSort)

      let service: Service = {
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
        try {
          // ToDo: move into separate function, to try to load spec and
          // validate for swagger 2.0 vs OpenApi 3.x
          const openApiYaml = await this.xrdRestMetaservice.getOpenAPI({
            xRoadInstance: sorted[i].xroadInstance,
            memberClass: sorted[i].memberClass,
            memberCode: sorted[i].memberCode,
            subsystemCode: sorted[i].subsystemCode,
            serviceCode: sorted[i].serviceCode,
          })

          const spec = YamlParser.safeLoad(openApiYaml) as OpenApi

          // The list is sorted for the latest service version to be the last element
          // so name, owner and description will be from the latest version.
          service.name = spec.info.title
          service.owner = spec.info.contact?.name
          service.description = spec.info.description
          service.data = _.union(service.data, spec.info.x_category)
          service.pricing = _.union(service.pricing, spec.info.x_pricing)
          service.xroadIdentifier.push({
            instance: sorted[i].xroadInstance,
            memberClass: sorted[i].memberClass,
            memberCode: sorted[i].memberCode,
            subsystemCode: sorted[i].subsystemCode,
            serviceCode: sorted[i].serviceCode,
          })
        } catch (err) {
          if (err.status && err.status === HttpStatus.INTERNAL_SERVER_ERROR) {
            // Error from X-Road calling getOpenApi
            logger.error(
              `Error calling getOpenApi for service ${sorted[i].subsystemCode}/${sorted[i].serviceCode}`,
            )
            logger.error(err.status, err.statusText, err.headers)
          } else {
            logger.error(err)
          }
        }
      }

      if (service.name) services.push(service)
    }

    return services
  }
}
