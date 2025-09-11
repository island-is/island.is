// TODO: Delete this file when shouldAuthIdsApiUseNationalRegistryV3 feature flag is removed
import * as faker from 'faker'
import request from 'supertest'

import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import {
  CompanyAddressType,
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import {
  UserProfileDto,
  UserProfileDtoLocaleEnum,
  V2MeApi,
} from '@island.is/clients/user-profile'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Features } from '@island.is/nest/feature-flags'
import {
  createCurrentUser,
  createNationalId,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../test/setup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mocked = <T extends (...args: any) => any>(value: T) => {
  return value as unknown as jest.Mock<ReturnType<T>, Parameters<T>>
}

const mockNationalRegistry = (
  nationalRegistryApi: NationalRegistryClientService,
  data: IndividualDto,
) => {
  mocked(nationalRegistryApi.getIndividual).mockResolvedValue(data)
}

const createCompany = (): CompanyExtendedInfo => {
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

const createUserProfile = ({ isRestricted = false }): UserProfileDto => {
  return {
    nationalId: faker.datatype.string(),
    email: faker.internet.email(),
    mobilePhoneNumber: faker.phone.phoneNumber(),
    locale: faker.random.arrayElement(
      Object.values(UserProfileDtoLocaleEnum) as UserProfileDtoLocaleEnum[],
    ),
    mobilePhoneNumberVerified: faker.datatype.boolean(),
    emailVerified: faker.datatype.boolean(),
    documentNotifications: faker.datatype.boolean(),
    profileImageUrl: faker.internet.url(),
    needsNudge: false,
    emailNotifications: false,
    isRestricted,
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
      app = await setupWithAuth({
        user: createCurrentUser({
          nationalIdType: 'person',
          scope: ['@identityserver.api/authentication'],
        }),
        features: [Features.userProfileClaims],
      })
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
          app.get(V2MeApi).meUserProfileControllerFindUserProfile,
        ).mockRejectedValue({ status: 404 })
        mocked(
          app.get(NationalRegistryClientService).getIndividual,
        ).mockResolvedValue(null)

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
          app.get(V2MeApi).meUserProfileControllerFindUserProfile,
        ).mockRejectedValue(new Error('500'))
        mocked(
          app.get(NationalRegistryClientService).getIndividual,
        ).mockRejectedValue(new Error('500'))

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual({})
        expect(errorLog).toHaveBeenCalledTimes(2)
      })

      it('with full registries should return all claims', async () => {
        // Arrange
        const userProfile = createUserProfile({})
        const individual = createNationalRegistryUser({
          genderCode: faker.random.arrayElement(['1', '3']),
        })
        mocked(
          app.get(V2MeApi).meUserProfileControllerFindUserProfile,
        ).mockResolvedValue(userProfile)
        mockNationalRegistry(app.get(NationalRegistryClientService), individual)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.legalDomicile!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const address = individual.residence!
        const expected = {
          address: {
            formatted: `${address.streetAddress}\n${address.postalCode} ${address.locality}\nÍsland`,
            locality: address.locality,
            postalCode: address.postalCode,
            streetAddress: address.streetAddress,
            country: 'Ísland',
          },
          birthdate: individual.birthdate.toISOString().split('T')[0],
          legalDomicile: {
            formatted: `${domicile.streetAddress}\n${domicile.postalCode} ${domicile.locality}\nÍsland`,
            streetAddress: domicile.streetAddress,
            postalCode: domicile.postalCode,
            locality: domicile.locality,
            country: 'Ísland',
          },
          email: userProfile.email,
          emailVerified: userProfile.emailVerified,
          familyName: individual.familyName,
          gender: 'male',
          givenName: individual.givenName,
          locale: userProfile.locale,
          middleName: individual.middleName,
          name: individual.name,
          phoneNumber: userProfile.mobilePhoneNumber,
          phoneNumberVerified: userProfile.mobilePhoneNumberVerified,
          picture: userProfile.profileImageUrl,
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toEqual(expected)
      })

      it('with isRestricted should not return email and phone data', async () => {
        // Arrange
        const userProfile = createUserProfile({ isRestricted: true })
        const individual = createNationalRegistryUser({
          genderCode: faker.random.arrayElement(['1', '3']),
        })
        mocked(
          app.get(V2MeApi).meUserProfileControllerFindUserProfile,
        ).mockResolvedValue(userProfile)
        mockNationalRegistry(app.get(NationalRegistryClientService), individual)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.legalDomicile!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const address = individual.residence!
        const expected = {
          address: {
            formatted: `${address.streetAddress}\n${address.postalCode} ${address.locality}\nÍsland`,
            locality: address.locality,
            postalCode: address.postalCode,
            streetAddress: address.streetAddress,
            country: 'Ísland',
          },
          birthdate: individual.birthdate.toISOString().split('T')[0],
          legalDomicile: {
            formatted: `${domicile.streetAddress}\n${domicile.postalCode} ${domicile.locality}\nÍsland`,
            streetAddress: domicile.streetAddress,
            postalCode: domicile.postalCode,
            locality: domicile.locality,
            country: 'Ísland',
          },
          familyName: individual.familyName,
          gender: 'male',
          givenName: individual.givenName,
          locale: userProfile.locale,
          middleName: individual.middleName,
          name: individual.name,
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
        individual.residence = null
        mockNationalRegistry(app.get(NationalRegistryClientService), individual)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.legalDomicile!
        const expected = {
          address: {
            formatted: `${domicile.streetAddress}\n${domicile.postalCode} ${domicile.locality}\nÍsland`,
            locality: domicile.locality,
            postalCode: domicile.postalCode,
            streetAddress: domicile.streetAddress,
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
        individual.genderCode = faker.random.arrayElement(['2', '4'])
        mockNationalRegistry(app.get(NationalRegistryClientService), individual)
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
        individual.genderCode = faker.random.arrayElement(['7', '8'])
        mockNationalRegistry(app.get(NationalRegistryClientService), individual)
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
