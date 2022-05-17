import request from 'supertest'
import * as faker from 'faker'

import {
  EinstaklingarApi,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import {
  CompanyAddressType,
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import {
  UserProfile,
  UserProfileApi,
  UserProfileLocaleEnum,
} from '@island.is/clients/user-profile'
import { TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'

import { setupWithAuth } from '../../../../test/setup'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mocked<T extends (...args: any) => any>(value: T) {
  return (value as unknown) as jest.Mock<ReturnType<T>, Parameters<T>>
}

const mockNationalRegistry = (
  einstaklingarApi: EinstaklingarApi,
  data: Einstaklingsupplysingar,
) => {
  mocked(einstaklingarApi.einstaklingarGetEinstaklingurRaw).mockResolvedValue({
    value: () => Promise.resolve(data),
    raw: { status: 200 } as Response,
  })
}

function createCompany(): CompanyExtendedInfo {
  return {
    name: faker.company.companyName(),
    address: {
      type: CompanyAddressType.address,
      streetAddress: faker.address.streetAddress(),
      locality: faker.address.city(),
      postalCode: faker.address.zipCode(),
      region: faker.address.state(),
      municipalityNumber: faker.random.word(),
      isPostbox: faker.datatype.boolean(),
      country: 'US',
    },
    legalDomicile: {
      type: CompanyAddressType.legalDomicile,
      streetAddress: faker.address.streetAddress(),
      locality: faker.address.city(),
      postalCode: faker.address.zipCode(),
      region: faker.address.state(),
      municipalityNumber: faker.random.word(),
      isPostbox: faker.datatype.boolean(),
      country: 'US',
    },
    addresses: [],
    formOfOperation: [],
    relatedParty: [],
    vat: [],
    nationalId: createNationalId('company'),
    status: faker.random.word(),
  } as CompanyExtendedInfo
}

function createUserProfile(): UserProfile {
  return {
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    mobilePhoneNumber: faker.phone.phoneNumber(),
    mobilePhoneNumberVerified: faker.datatype.boolean(),
    profileImageUrl: faker.internet.url(),
    locale: faker.random.arrayElement(
      Object.values(UserProfileLocaleEnum) as UserProfileLocaleEnum[],
    ),
    created: faker.date.past(),
    id: faker.datatype.uuid(),
    documentNotifications: faker.datatype.boolean(),
    emailStatus: faker.datatype.string(),
    mobileStatus: faker.datatype.string(),
    modified: faker.date.past(),
    nationalId: faker.datatype.string(),
  }
}

describe('UserProfileController', () => {
  const path = '/user-profile'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('with auth as individual', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    beforeAll(async () => {
      const user = createCurrentUser({
        nationalIdType: 'person',
        scope: ['@identityserver.api/authentication'],
      })
      app = await setupWithAuth({ user })
      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET /user-profile', () => {
      it('with empty registries should return no claims', async () => {
        // Arrange
        const errorLog = jest
          .spyOn(app.get<Logger>(LOGGER_PROVIDER), 'error')
          .mockImplementation()
        mocked(
          app.get(UserProfileApi).userProfileControllerFindOneByNationalId,
        ).mockRejectedValue({ status: 404 })
        mocked(
          app.get(EinstaklingarApi).einstaklingarGetEinstaklingurRaw,
        ).mockRejectedValue({ status: 404 })

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
        expect(errorLog).toHaveBeenCalledTimes(0)
      })

      it('with 204 response from natreg should return no claims', async () => {
        // Arrange
        const errorLog = jest
          .spyOn(app.get<Logger>(LOGGER_PROVIDER), 'error')
          .mockImplementation()
        mocked(
          app.get(UserProfileApi).userProfileControllerFindOneByNationalId,
        ).mockRejectedValue({ status: 404 })
        mocked(
          app.get(EinstaklingarApi).einstaklingarGetEinstaklingurRaw,
        ).mockResolvedValue({
          value: () => Promise.reject('JSON ERROR'),
          raw: { status: 204 } as Response,
        })

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
        expect(errorLog).toHaveBeenCalledTimes(0)
      })

      it('with failing registries should log and return no claims', async () => {
        // Arrange
        const errorLog = jest
          .spyOn(app.get<Logger>(LOGGER_PROVIDER), 'error')
          .mockImplementation()
        mocked(
          app.get(UserProfileApi).userProfileControllerFindOneByNationalId,
        ).mockRejectedValue(new Error('500'))
        mocked(
          app.get(EinstaklingarApi).einstaklingarGetEinstaklingurRaw,
        ).mockRejectedValue(new Error('500'))

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
        expect(errorLog).toHaveBeenCalledTimes(2)
      })

      it('with full registries should return all claims', async () => {
        // Arrange
        const userProfile = createUserProfile()
        const individual = createNationalRegistryUser({
          kynkodi: faker.random.arrayElement(['1', '3']),
        })
        mocked(
          app.get(UserProfileApi).userProfileControllerFindOneByNationalId,
        ).mockResolvedValue(userProfile)
        mockNationalRegistry(app.get(EinstaklingarApi), individual)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.logheimili!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const address = individual.adsetur!
        const expected = {
          address: {
            formatted: `${address.heiti}\n${address.postnumer} ${address.stadur}\nÍsland`,
            locality: address.stadur,
            postalCode: address.postnumer,
            streetAddress: address.heiti,
            country: 'Ísland',
          },
          birthdate: individual.faedingardagur.toISOString().split('T')[0],
          legalDomicile: {
            formatted: `${domicile.heiti}\n${domicile.postnumer} ${domicile.stadur}\nÍsland`,
            streetAddress: domicile.heiti,
            postalCode: domicile.postnumer,
            locality: domicile.stadur,
            country: 'Ísland',
          },
          email: userProfile.email,
          emailVerified: userProfile.emailVerified,
          familyName: individual.kenninafn,
          gender: 'male',
          givenName: individual.eiginnafn,
          locale: userProfile.locale,
          middleName: individual.millinafn,
          name: individual.nafn,
          phoneNumber: userProfile.mobilePhoneNumber,
          phoneNumberVerified: userProfile.mobilePhoneNumberVerified,
          picture: userProfile.profileImageUrl,
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual(expected)
      })

      it('should return domicile as address if residence is missing', async () => {
        // Arrange
        const individual = createNationalRegistryUser()
        individual.adsetur = null
        mockNationalRegistry(app.get(EinstaklingarApi), individual)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.logheimili!
        const expected = {
          address: {
            formatted: `${domicile.heiti}\n${domicile.postnumer} ${domicile.stadur}\nÍsland`,
            locality: domicile.stadur,
            postalCode: domicile.postnumer,
            streetAddress: domicile.heiti,
          },
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toMatchObject(expected)
      })

      it('should support female gender', async () => {
        // Arrange
        const individual = createNationalRegistryUser()
        individual.kynkodi = faker.random.arrayElement(['2', '4'])
        mockNationalRegistry(app.get(EinstaklingarApi), individual)
        const expected = {
          gender: 'female',
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toMatchObject(expected)
      })

      it('should support non-binary gender', async () => {
        // Arrange
        const individual = createNationalRegistryUser()
        individual.kynkodi = faker.random.arrayElement(['7', '8'])
        mockNationalRegistry(app.get(EinstaklingarApi), individual)
        const expected = {
          gender: 'non-binary',
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toMatchObject(expected)
      })
    })
  })

  describe('with auth as company delegation', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    beforeAll(async () => {
      const user = createCurrentUser({
        nationalIdType: 'company',
        scope: ['@identityserver.api/authentication'],
      })
      app = await setupWithAuth({ user })
      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET /user-profile', () => {
      it('with empty registries should return no claims', async () => {
        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
      })

      it('with failing registries should log and return no claims', async () => {
        // Arrange
        const errorLog = jest
          .spyOn(app.get<Logger>(LOGGER_PROVIDER), 'error')
          .mockImplementation()
        mocked(
          app.get(CompanyRegistryClientService).getCompany,
        ).mockRejectedValue(new Error('test error'))

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(errorLog).toHaveBeenCalledTimes(1)
        expect(res.body).toEqual({})
      })

      it('with missing data should return no claims', async () => {
        // Arrange
        mocked(
          app.get(CompanyRegistryClientService).getCompany,
        ).mockResolvedValue(null)

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
      })

      it('with full registries should return company claims', async () => {
        // Arrange
        const company = createCompany()
        mocked(
          app.get(CompanyRegistryClientService).getCompany,
        ).mockResolvedValue(company)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = company.legalDomicile!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const address = company.address!
        const expected = {
          name: company.name,
          address: {
            formatted: `${address.streetAddress}\n${address.postalCode} ${address.locality}\nBandaríkin`,
            locality: address.locality,
            postalCode: address.postalCode,
            streetAddress: address.streetAddress,
            country: 'Bandaríkin',
          },
          legalDomicile: {
            formatted: `${domicile.streetAddress}\n${domicile.postalCode} ${domicile.locality}\nBandaríkin`,
            locality: domicile.locality,
            postalCode: domicile.postalCode,
            streetAddress: domicile.streetAddress,
            country: 'Bandaríkin',
          },
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual(expected)
      })
    })
  })
})
