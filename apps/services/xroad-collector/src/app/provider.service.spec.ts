import { Test } from '@nestjs/testing'
import {
  ClientList,
  ListClientsRequest,
  MetaservicesApi,
  XroadIdentifierIdObjectTypeEnum,
} from '../../gen/fetch-xrd'

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
            memberCode: '10003',
            subsystemCode: 'islandis-Client',
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
  })

  describe('getPrivateProviders', () => {
    it('should return all and only private service providers', async () => {
      const providers = await service.getPrivateProviders()
      expect(providers).toEqual([
        {
          memberClass: 'GOV',
          memberCode: '10001',
          subsystemCode: 'VMST-Private',
          type: 'private',
          xroadInstance: 'IS-DEV',
        },
      ])
    })
  })

  describe('getProtectedProviders', () => {
    it('should return all and only protected service providers', async () => {
      const providers = await service.getProtectedProviders()
      expect(providers).toEqual([
        {
          memberClass: 'GOV',
          memberCode: '10001',
          subsystemCode: 'VMST-Protected',
          type: 'protected',
          xroadInstance: 'IS-DEV',
        },
        {
          memberClass: 'GOV',
          memberCode: '10002',
          subsystemCode: 'SKRA-Protected',
          type: 'protected',
          xroadInstance: 'IS-DEV',
        },
      ])
    })
  })

  describe('getPublicProviders', () => {
    it('should return all and only `public` service providers', async () => {
      const providers = await service.getPublicProviders()
      expect(providers).toEqual([
        {
          memberClass: 'GOV',
          memberCode: '10001',
          subsystemCode: 'VMST-Public',
          type: 'public',
          xroadInstance: 'IS-DEV',
        },
        {
          memberClass: 'GOV',
          memberCode: '10002',
          subsystemCode: 'SKRA-Public',
          type: 'public',
          xroadInstance: 'IS-DEV',
        },
      ])
    })
  })
})
