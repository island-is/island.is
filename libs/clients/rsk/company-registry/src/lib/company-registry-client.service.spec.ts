import { Logger } from '@island.is/logging'
import faker from 'faker'

import { FetchError } from '@island.is/clients/middlewares'

import {
  CompanyAddress,
  CompanyAddressType,
  CompanyExtendedInfo,
  CompanySearchResults,
  SearchRequest,
} from './types'
import { CompanyRegistryClientService } from './company-registry-client.service'
import { DefaultApi } from './gen/fetch'

describe('CompanyRegistryClientService', () => {
  let api: DefaultApi
  let service: CompanyRegistryClientService
  beforeEach(() => {
    api = new DefaultApi()
    const logger = {} as unknown as Logger
    service = new CompanyRegistryClientService(api, logger)
  })
  it('maps company endpoint', async () => {
    // Arrange
    const company = {
      kennitala: faker.random.word(),
      nafn: faker.random.word(),
      link: [],
      sidastUppfaert: faker.date.past().toISOString(),
      stada: faker.random.word(),
      skrad: faker.date.past().toISOString(),
      heimilisfang: [
        {
          gerd: 'Lögheimili',
          heimilisfang: faker.address.streetAddress(),
          postnumer: faker.address.zipCode(),
          erPostholf: faker.datatype.number(1).toString(),
          stadur: faker.address.city(),
          land: faker.address.countryCode(),
          byggd: faker.random.word(),
          sveitarfelaganumer: faker.random.word(),
        },
        {
          gerd: 'Póstfang',
          heimilisfang: faker.address.streetAddress(),
          postnumer: faker.address.zipCode(),
          erPostholf: faker.datatype.number(1).toString(),
          stadur: faker.address.city(),
          land: faker.address.countryCode(),
          byggd: faker.random.word(),
          sveitarfelaganumer: faker.random.word(),
        },
      ],
      rekstrarform: [
        {
          heiti: faker.random.word(),
          tegund: faker.random.word(),
        },
      ],
      tengdirAdilar: [
        {
          tegund: faker.random.word(),
          nafn: faker.name.findName(),
          kennitala: faker.random.word(),
        },
      ],
      virdisaukaskattur: [
        {
          vskNumer: faker.random.word(),
          stada: faker.random.word(),
          skrad: faker.date.past().toISOString(),
          afskraning: faker.date.past().toISOString(),
          flokkun: [
            {
              gerd: faker.random.word(),
              heiti: faker.random.word(),
              flokkunarkerfi: faker.random.word(),
              numer: faker.random.word(),
            },
          ],
        },
      ],
    }
    const addresses = company.heimilisfang.map<CompanyAddress>((address) => ({
      streetAddress: address.heimilisfang,
      type: address.gerd as CompanyAddressType,
      postalCode: address.postnumer,
      locality: address.stadur,
      country: address.land,
      isPostbox: address.erPostholf === '1',
      region: address.byggd,
      municipalityNumber: address.sveitarfelaganumer,
    }))
    const expected: CompanyExtendedInfo = {
      name: company.nafn,
      status: company.stada,
      nationalId: company.kennitala,
      dateOfRegistration: new Date(company.skrad),
      lastUpdated: new Date(company.sidastUppfaert),
      addresses,
      legalDomicile: addresses[0],
      address: addresses[1],
      vat: company.virdisaukaskattur.map((vat) => ({
        vatNumber: vat.vskNumer,
        dateOfRegistration: new Date(vat.skrad),
        dateOfDeregistration: new Date(vat.afskraning),
        classification: vat.flokkun.map((category) => ({
          classificationSystem: category.flokkunarkerfi,
          name: category.heiti,
          number: category.numer,
          type: category.gerd,
        })),
      })),
      relatedParty: company.tengdirAdilar.map((party) => ({
        name: party.nafn,
        nationalId: party.kennitala,
        type: party.tegund,
      })),
      formOfOperation: company.rekstrarform.map((form) => ({
        name: form.heiti,
        type: form.tegund,
      })),
    }
    const input = faker.random.word()
    const ssidGet = jest.spyOn(api, 'ssidGet').mockResolvedValue(company)

    // Act
    const result = await service.getCompany(input)

    // Assert
    expect(ssidGet).toHaveBeenCalledWith({ ssid: input })
    expect(result).toEqual(expected)
  })

  it('returns 404 as null', async () => {
    // Arrange
    jest
      .spyOn(api, 'ssidGet')
      .mockRejectedValue(await FetchError.buildMock({ status: 404 }))

    // Act
    const result = await service.getCompany('123')

    // Assert
    expect(result).toBeNull()
  })

  it('maps search endpoint', async () => {
    // Arrange
    const apiData = {
      count: faker.datatype.number(),
      hasMore: faker.datatype.boolean(),
      limit: faker.datatype.number(),
      offset: faker.datatype.number(),
      items: [
        {
          vskNumer: faker.random.word(),
          nafn: faker.random.word(),
          stada: faker.random.word(),
          skrad: faker.date.past().toISOString(),
          kennitala: faker.random.word(),
          sidastUppfaert: faker.date.past().toISOString(),
        },
      ],
    }
    const search = jest
      .spyOn(api, 'searchSearchStringGet')
      .mockResolvedValue(apiData)
    const expected: CompanySearchResults = {
      count: apiData.count,
      hasMore: apiData.hasMore,
      limit: apiData.limit,
      offset: apiData.offset,
      items: apiData.items.map((item) => ({
        name: item.nafn,
        nationalId: item.kennitala,
        vatNumber: item.vskNumer,
        status: item.stada,
        dateOfRegistration: new Date(item.skrad),
        lastUpdated: new Date(item.sidastUppfaert),
      })),
    }
    const request: SearchRequest = {
      searchString: faker.random.word(),
      limit: faker.datatype.number(),
      offset: faker.datatype.number(),
    }

    // Act
    const result = await service.searchCompanies(request)

    // Assert
    expect(search).toHaveBeenCalledWith(request)
    expect(result).toEqual(expected)
  })
})
