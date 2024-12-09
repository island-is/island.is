import { Logger } from '@island.is/logging'
import { faker } from '@faker-js/faker'

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
      kennitala: faker.word.sample(),
      nafn: faker.word.sample(),
      link: [],
      sidastUppfaert: faker.date.past().toISOString(),
      stada: faker.word.sample(),
      skrad: faker.date.past().toISOString(),
      heimilisfang: [
        {
          gerd: 'Lögheimili',
          heimilisfang: faker.location.streetAddress(),
          postnumer: faker.location.zipCode(),
          erPostholf: faker.number.int(1).toString(),
          stadur: faker.location.city(),
          land: faker.location.countryCode(),
          byggd: faker.word.sample(),
          sveitarfelaganumer: faker.word.sample(),
        },
        {
          gerd: 'Póstfang',
          heimilisfang: faker.location.streetAddress(),
          postnumer: faker.location.zipCode(),
          erPostholf: faker.number.int(1).toString(),
          stadur: faker.location.city(),
          land: faker.location.countryCode(),
          byggd: faker.word.sample(),
          sveitarfelaganumer: faker.word.sample(),
        },
      ],
      rekstrarform: [
        {
          heiti: faker.word.sample(),
          tegund: faker.word.sample(),
        },
      ],
      tengdirAdilar: [
        {
          tegund: faker.word.sample(),
          nafn: faker.person.fullName(),
          kennitala: faker.word.sample(),
        },
      ],
      virdisaukaskattur: [
        {
          vskNumer: faker.word.sample(),
          stada: faker.word.sample(),
          skrad: faker.date.past().toISOString(),
          afskraning: faker.date.past().toISOString(),
          flokkun: [
            {
              gerd: faker.word.sample(),
              heiti: faker.word.sample(),
              flokkunarkerfi: faker.word.sample(),
              numer: faker.word.sample(),
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
    const input = faker.word.sample()
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
      count: faker.number.int(),
      hasMore: faker.datatype.boolean(),
      limit: faker.number.int(),
      offset: faker.number.int(),
      items: [
        {
          vskNumer: faker.word.sample(),
          nafn: faker.word.sample(),
          stada: faker.word.sample(),
          skrad: faker.date.past().toISOString(),
          kennitala: faker.word.sample(),
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
      searchString: faker.word.sample(),
      limit: faker.number.int(),
      offset: faker.number.int(),
    }

    // Act
    const result = await service.searchCompanies(request)

    // Assert
    expect(search).toHaveBeenCalledWith(request)
    expect(result).toEqual(expected)
  })
})
