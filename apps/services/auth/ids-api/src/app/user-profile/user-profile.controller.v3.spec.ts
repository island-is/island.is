import * as faker from 'faker'
// TODO: Rename this file when v2 tests are deleted
import request from 'supertest'

import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
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
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { createNationalRegistryV3User } from '../../../test/nationalRegistryV3User'
import { setupWithAuth } from '../../../test/setup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mocked<T extends (...args: any) => any>(value: T) {
  return value as unknown as jest.Mock<ReturnType<T>, Parameters<T>>
}

const mockNationalRegistry = (
  nationalRegistryApi: NationalRegistryV3ClientService,
  data: EinstaklingurDTOAllt,
) => {
  mocked(nationalRegistryApi.getAllDataIndividual).mockResolvedValue(data)
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

function createUserProfile({ isRestricted = false }): UserProfileDto {
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
          app.get(NationalRegistryV3ClientService).getAllDataIndividual,
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
          app.get(NationalRegistryV3ClientService).getAllDataIndividual,
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
        const individual = createNationalRegistryV3User({
          kyn: { kynKodi: faker.random.arrayElement(['1', '3']) },
        })
        mocked(
          app.get(V2MeApi).meUserProfileControllerFindUserProfile,
        ).mockResolvedValue(userProfile)
        mockNationalRegistry(
          app.get(NationalRegistryV3ClientService),
          individual,
        )

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.heimilisfang!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const address = individual.itarupplysingar!.adsetur!
        const expected = {
          address: {
            formatted: `${address.husHeiti}\n${address.postnumer} ${address.poststod}\nÍsland`,
            locality: address.poststod,
            postalCode: address.postnumer,
            streetAddress: address.husHeiti,
            country: 'Ísland',
          },
          birthdate: individual.faedingarstadur?.faedingarDagur
            ?.toISOString()
            .split('T')[0],
          legalDomicile: {
            formatted: `${domicile.husHeiti}\n${domicile.postnumer} ${domicile.poststod}\nÍsland`,
            streetAddress: domicile.husHeiti,
            postalCode: domicile.postnumer,
            locality: domicile.poststod,
            country: 'Ísland',
          },
          email: userProfile.email,
          emailVerified: userProfile.emailVerified,
          familyName: individual.fulltNafn?.kenniNafn,
          gender: 'male',
          givenName: individual.fulltNafn?.eiginNafn,
          locale: userProfile.locale,
          middleName: individual.fulltNafn?.milliNafn,
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
        const individual = createNationalRegistryV3User({
          itarupplysingar: {},
        })
        mockNationalRegistry(
          app.get(NationalRegistryV3ClientService),
          individual,
        )

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const domicile = individual.heimilisfang!
        const expected = {
          address: {
            formatted: `${domicile.husHeiti}\n${domicile.postnumer} ${domicile.poststod}\nÍsland`,
            streetAddress: domicile.husHeiti,
            postalCode: domicile.postnumer,
            locality: domicile.poststod,
          },
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toMatchObject(expected)
      })

      it('should support female gender', async () => {
        // Arrange
        const individual = createNationalRegistryV3User({
          kyn: { kynKodi: faker.random.arrayElement(['2', '4']) },
        })
        mockNationalRegistry(
          app.get(NationalRegistryV3ClientService),
          individual,
        )
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
        const individual = createNationalRegistryV3User({
          kyn: { kynKodi: faker.random.arrayElement(['7', '8']) },
        })
        mockNationalRegistry(
          app.get(NationalRegistryV3ClientService),
          individual,
        )
        const expected = {
          gender: 'non-binary',
        }

        // Act
        const res = await server.get(path).expect(200)

        // Assert
        expect(res.body).toMatchObject(expected)
      })
    })

    it('should return Ísland if address is valid', async () => {
      // Arrange
      const individual = createNationalRegistryV3User({
        itarupplysingar: {
          adsetur: {
            husHeiti: faker.address.streetName(),
            postnumer: faker.address.zipCode(),
            poststod: faker.address.city(),
          },
        },
      })
      mockNationalRegistry(app.get(NationalRegistryV3ClientService), individual)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const address = individual.itarupplysingar!.adsetur!
      const expected = {
        address: {
          formatted: `${address.husHeiti}\n${address.postnumer} ${address.poststod}\nÍsland`,
          streetAddress: address.husHeiti,
          postalCode: address.postnumer,
          locality: address.poststod,
          country: 'Ísland',
        },
      }

      // Act
      const res = await server.get(path).expect(200)

      // Assert
      expect(res.body).toMatchObject(expected)
    })

    it('should return country if registered', async () => {
      // Arrange
      const country = faker.address.country()
      const individual = createNationalRegistryV3User({
        itarupplysingar: {
          adsetur: {
            husHeiti: country,
            postnumer: undefined,
            poststod: undefined,
          },
        },
      })
      mockNationalRegistry(app.get(NationalRegistryV3ClientService), individual)

      const expected = {
        address: {
          country: country,
        },
      }

      // Act
      const res = await server.get(path).expect(200)

      // Assert
      expect(res.body).toMatchObject(expected)
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
