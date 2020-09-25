import { Injectable } from '@nestjs/common'
import {
  MetaservicesApi,
  XroadIdentifierIdObjectTypeEnum,
  XroadIdentifierId,
  XroadIdentifier,
} from '../../gen/fetch-xrd'
import { MethodList, RestMetaservicesApi } from '../../gen/fetch-xrd-rest'

export interface XRoadClient {
  xroadInstance: string
  memberClass: string
  memberCode: string
  subsystemCode: string
  services: Array<ServiceDescription>
}

export interface ServiceDescription {
  owner: string
  name: string
  pricing: Array<string>
  categories: Array<string>
  type: Array<string>
  access: Array<string>
  spec: string
}

const errorHandler = (err) => {
  console.log(err.url, err.status, err.statusText)
  console.log(err.headers)
  throw err
}

@Injectable()
export class XroadClientService {
  constructor(
    private readonly xrdMetaService: MetaservicesApi,
    private readonly xrdRestMetaService: RestMetaservicesApi,
  ) {}

  /**
   * Gets all clients from X-Road environment of the object type: SUBSYSTEM
   */
  async getClients(): Promise<Array<XRoadClient>> {
    let clients = await this.xrdMetaService.listClients({})

    if (clients?.member?.length > 0) {
      return clients?.member
        ?.filter((el) => {
          return el.id?.objectType == XroadIdentifierIdObjectTypeEnum.SUBSYSTEM
        })
        .map((item) => {
          return {
            xroadInstance: item.id?.xroadInstance,
            memberClass: item.id?.memberClass,
            memberCode: item.id?.memberCode,
            subsystemCode: item.id?.subsystemCode,
            services: [],
          }
        })
    } else {
      throw new Error('Failed to get list of clients from X-Road')
    }
  }

  async getServices(): Promise<MethodList> {
    console.log('Get services for client')
    const serviceList = await this.xrdRestMetaService.listMethods({
      xRoadInstance: 'PLAYGROUND',
      memberClass: 'GOV',
      memberCode: '8765432-1',
      subsystemCode: 'TestService',
    })

    console.log(serviceList)
    return serviceList
  }

  async getService(serviceId: string): Promise<string> {
    console.log(`Getting OpenAPI for ${serviceId}`)
    return this.xrdRestMetaService.getOpenAPI({
      xRoadInstance: 'PLAYGROUND',
      memberClass: 'GOV',
      memberCode: '8765432-1',
      subsystemCode: 'TestService',
      serviceCode: serviceId,
    })
  }

  /**
   * Gets all services a single client returned from @see getClients() exposes
   * in the X-Road network
   * @param xroadIdentifier Identifies client in the X-Road network
   */
  async getData() {
    const clients = await this.getClients()

    clients.forEach(async (client) => {
      let services = await this.xrdRestMetaService.listMethods({
        memberClass: client.memberClass,
        memberCode: client.memberCode,
        subsystemCode: client.subsystemCode,
        xRoadInstance: client.xroadInstance,
      })

      console.log(`Services for ${client.subsystemCode}`)
      console.log(services)
      if (services.service)
        console.log(`Found ${services.service.length} services`)

      for (let i = 0; i < services.service?.length; i++) {
        const spec = await this.xrdRestMetaService.getOpenAPI({
          xRoadInstance: client.xroadInstance,
          memberClass: client.memberClass,
          memberCode: client.memberCode,
          subsystemCode: client.subsystemCode,
          serviceCode: services.service[i].serviceCode,
        })

        const api = await SwaggerParser.dereference(spec)

        client.services.push({
          spec: spec,
          name: api.info.title,
          owner: api.info.contact.name, // or read from current client subsystem node?
          access: [],
          categories: [],
          pricing: [],
          type: ['REST'],
        })
      }
    })

    return clients
  }
}
