import { Test } from '@nestjs/testing'
import { Providers } from '@island.is/api-catalogue/types'
import {
  ClientList,
  ListClientsRequest,
  MetaservicesApi,
  XroadIdentifierIdObjectTypeEnum,
} from '../../gen/fetch/xrd'

import { ProviderService } from './provider.service'

class MetaservicesApiMock {
  listClients(_: ListClientsRequest): Promise<ClientList> {
    return Promise.resolve<ClientList>({
      member: [
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'VMST',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'SKRA',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10003',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'island.is',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Private',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'VMST',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Protected',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'VMST',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Public',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'VMST',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'SKRA-Protected',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'SKRA',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'SKRA-Public',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'SKRA',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'TJO',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'SKRA',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10003',
            subsystemCode: 'islandis-Client',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'island.is',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10003',
            subsystemCode: 'islandis-is',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'island.is',
        },
      ],
    })
  }
}

describe('ProviderService', () => {
  let service: ProviderService
  let providers: Providers

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        ProviderService,
        {
          provide: MetaservicesApi,
          useClass: MetaservicesApiMock,
        },
      ],
    }).compile()

    service = app.get<ProviderService>(ProviderService)
    providers = await service.getProviders()
  })

  describe('getPrivateProviders', () => {
    it('should return all and only private service providers', async () => {
      expect(providers.private).toEqual([
        {
          name: 'VMST',
          type: 'private',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Private',
          },
        },
      ])
    })
  })

  describe('getProtectedProviders', () => {
    it('should return all and only protected service providers', async () => {
      expect(providers.protected).toEqual([
        {
          name: 'VMST',
          type: 'protected',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Protected',
          },
        },
        {
          name: 'SKRA',
          type: 'protected',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'SKRA-Protected',
          },
        },
        {
          name: 'SKRA',
          type: 'protected',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'TJO',
          },
        },
        {
          name: 'island.is',
          type: 'protected',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10003',
            subsystemCode: 'islandis-is',
          },
        },
      ])
    })
  })

  describe('getPublicProviders', () => {
    it('should return all and only `public` service providers', async () => {
      expect(providers.public).toEqual([
        {
          name: 'VMST',
          type: 'public',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001',
            subsystemCode: 'VMST-Public',
          },
        },
        {
          name: 'SKRA',
          type: 'public',
          xroadInfo: {
            instance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002',
            subsystemCode: 'SKRA-Public',
          },
        },
      ])
    })
  })
})
