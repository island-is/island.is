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
            memberCode: '10001-0',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'Agency1-Clients',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-1',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'Agency1-Private',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-2',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'Agency1-Protected',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-3',
            objectType: XroadIdentifierIdObjectTypeEnum.MEMBER,
          },
          name: 'Agency1-Public',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-1',
            subsystemCode: 'TestService',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency1-Private',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-2',
            subsystemCode: 'TestService',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency1-Protected',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10001-3',
            subsystemCode: 'TestService',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency1-Public',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002-2',
            subsystemCode: 'TestService',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency2-Protected',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10002-3',
            subsystemCode: 'TestService',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency2-Public',
        },
        {
          id: {
            xroadInstance: 'IS-DEV',
            memberClass: 'GOV',
            memberCode: '10003-1',
            subsystemCode: 'TestServicePublic',
            objectType: XroadIdentifierIdObjectTypeEnum.SUBSYSTEM,
          },
          name: 'Agency3-Private',
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
          memberCode: '10001-1',
          subsystemCode: 'TestService',
          type: 1,
          xroadInstance: 'IS-DEV',
        },
        {
          memberClass: 'GOV',
          memberCode: '10003-1',
          subsystemCode: 'TestServicePublic',
          type: 1,
          xroadInstance: 'IS-DEV',
        },
      ])
    })
  })
})
