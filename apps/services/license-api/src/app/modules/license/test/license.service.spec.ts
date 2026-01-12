import {
  BaseLicenseUpdateClient,
  LicenseType,
  LicenseUpdateClientService,
} from '@island.is/clients/license-client'
import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import {
  BarcodeData,
  BarcodeService,
  LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
  LicenseConfig,
  TOKEN_EXPIRED_ERROR,
} from '@island.is/services/license'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { Cache } from 'cache-manager'
import * as faker from 'faker'

import ShortUniqueId from 'short-unique-id'
import { VerifyInputData } from '../dto/verifyLicense.input'
import { LicenseServiceV1 } from '../services/licenseV1.service'
import {
  LicenseId,
  LicenseUpdateType,
  PASS_TEMPLATE_IDS,
} from '../license.types'

const { randomUUID } = new ShortUniqueId({ length: 16 })
const cacheStore = new Map<string, unknown>()
const licenseIds = Object.values(LicenseId)

const createCacheData = (licenseId: LicenseId): BarcodeData<LicenseType> => ({
  nationalId: faker.datatype.number({ min: 10, max: 10 }).toString(),
  licenseType: getLicenseType(licenseId),
  extraData: {
    name: faker.name.firstName(),
    nationalId: faker.datatype.number({ min: 10, max: 10 }).toString(),
  },
})

const getLicenseType = (id: LicenseId) => {
  switch (id) {
    case LicenseId.DRIVING_LICENSE:
      return LicenseType.DrivingLicense
    case LicenseId.DISABILITY_LICENSE:
      return LicenseType.DisabilityLicense
    case LicenseId.FIREARM_LICENSE:
      return LicenseType.FirearmLicense
    case LicenseId.HUNTING_LICENSE:
      return LicenseType.HuntingLicense
  }
}

@Injectable()
export class MockUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  pushUpdate = (inputData: PassDataInput, nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<Pass | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  pullUpdate = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<Pass | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  revoke = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: true,
        data: {
          success: true,
        },
      })
    }

    if (nationalId === 'failure') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: true,
        data: {
          success: false,
        },
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<RevokePassData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  verify = (inputData: string) => {
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      })
    }

    const { code } = parsedInput
    if (!code) {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      })
    }

    if (code === 'success') {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: true,
        data: {
          valid: true,
        },
      })
    }

    if (code === 'failure') {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: true,
        data: {
          valid: false,
        },
      })
    }
    //some other error
    return Promise.resolve<Result<VerifyPassData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }
}

describe('LicenseService', () => {
  let licenseService: LicenseServiceV1
  let barcodeService: BarcodeService
  let config: ConfigType<typeof LicenseConfig>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [LicenseConfig],
        }),
      ],
      providers: [
        LicenseServiceV1,
        BarcodeService,
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            debug: () => ({}),
            info: () => ({}),
            error: () => ({}),
          })),
        },
        {
          provide: LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
          useClass: jest.fn(() => ({
            get: (key: string) => cacheStore.get(key),
            set: (key: string, value: unknown) => cacheStore.set(key, value),
          })),
        },
        {
          provide: SmartSolutionsApi,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: PASS_TEMPLATE_IDS,
          useValue: {
            disability: LicenseId.DISABILITY_LICENSE,
            firearm: LicenseId.FIREARM_LICENSE,
            driving: LicenseId.DRIVING_LICENSE,
          },
        },
        {
          provide: LicenseUpdateClientService,
          useFactory: (logger, smart) => ({
            getLicenseUpdateClientByType:
              async (): Promise<BaseLicenseUpdateClient | null> =>
                new MockUpdateClient(logger, smart),
            getLicenseUpdateClientByPassTemplateId:
              async (): Promise<BaseLicenseUpdateClient | null> =>
                new MockUpdateClient(logger, smart),
          }),
          inject: [LOGGER_PROVIDER, SmartSolutionsApi],
        },
        {
          provide: BarcodeService,
          useFactory: () => {
            return new BarcodeService(
              {
                barcodeSecretKey: 'secret',
                barcodeExpireTimeInSec: 60,
                barcodeSessionExpireTimeInSec: 3600,
              } as ConfigType<typeof LicenseConfig>,
              cacheStore as unknown as Cache,
            )
          },
          inject: [LicenseConfig.KEY],
        },
      ],
    }).compile()

    licenseService = moduleRef.get<LicenseServiceV1>(LicenseServiceV1)
    barcodeService = moduleRef.get<BarcodeService>(BarcodeService)
    config = moduleRef.get(LicenseConfig.KEY)
  })

  describe.each(licenseIds)('given %s license type id', (licenseId) => {
    describe('verify', () => {
      it(`should verify the ${licenseId} license`, async () => {
        //act
        const result = await licenseService.verifyLicense({
          barcodeData: JSON.stringify({
            passTemplateId: licenseId.toString(),
            passTemplateName: licenseId.toString(),
            code: 'success',
            date: '2022-06-28T15:42:11.665950Z',
          }),
        })

        //assert
        expect(result).toMatchObject({
          valid: true,
        })
      })

      it(`should verify barcodeData as token for the ${licenseId} license`, async () => {
        // Act
        const code = randomUUID()
        const data =
          licenseId === LicenseId.DRIVING_LICENSE
            ? createCacheData(licenseId)
            : undefined

        // Create token
        const token = await barcodeService.createToken({
          v: '1',
          t: getLicenseType(licenseId),
          c: code,
        })

        if (data) {
          // Put data in cache
          await barcodeService.setCache(code, data)
        }

        const result = await licenseService.verifyLicense({
          barcodeData: token.token,
        })

        // Assert
        // Only driver's license is able to get extra data from the token for now
        if (licenseId !== LicenseId.DRIVING_LICENSE) {
          expect(result).toMatchObject({
            valid: false,
          })
        } else {
          expect(result).toMatchObject({
            valid: true,
            passIdentity: {
              nationalId: data?.nationalId,
              name: data?.extraData?.name,
            },
          })
        }
      })

      it(`should fail to verify barcodeData token because of token expire time for the ${licenseId} license`, async () => {
        jest.useFakeTimers({
          advanceTimers: true,
        })

        // Act
        const code = randomUUID()
        const data = createCacheData(licenseId)

        // Create token
        const token = await barcodeService.createToken({
          v: '1',
          t: getLicenseType(licenseId),
          c: code,
        })

        // Put data in cache
        await barcodeService.setCache(code, data)

        // Let the token expire
        jest.advanceTimersByTime(config.barcodeExpireTimeInSec * 1000)

        // Assert
        const result = await licenseService.verifyLicense({
          barcodeData: token.token,
        })

        expect(result).toEqual({
          valid: false,
        })
      })

      it(`should fail to verify the ${licenseId}  license`, async () => {
        //act
        const result = await licenseService.verifyLicense({
          barcodeData: JSON.stringify({
            passTemplateId: licenseId.toString(),
            passTemplateName: licenseId.toString(),
            code: 'failure',
            date: '2022-06-28T15:42:11.665950Z',
          }),
        })

        //assert
        expect(result).toMatchObject({
          valid: false,
        })
      })
      it(`should throw user error on bad input when trying to verify the ${licenseId} license`, async () => {
        //act
        const result = licenseService.verifyLicense({
          barcodeData: JSON.stringify({
            passTemplateId: licenseId.toString(),
            passTemplateName: licenseId.toString(),
            code: '',
            date: '2022-06-28T15:42:11.665950Z',
          }),
        })

        //assert
        await expect(result).rejects.toThrow(
          new BadRequestException(['Invalid input data']),
        )
      })

      it(`should throw 500 error when client return an error with error code > 10 when trying to verify the ${licenseId} license`, async () => {
        //act
        const result = licenseService.verifyLicense({
          barcodeData: JSON.stringify({
            passTemplateId: licenseId.toString(),
            passTemplateName: licenseId.toString(),
            code: 'invalid',
            date: '2022-06-28T15:42:11.665950Z',
          }),
        })

        //assert
        await expect(result).rejects.toThrow(
          new InternalServerErrorException(['some service error']),
        )
      })
    })
    describe('revoke', () => {
      it(`should to revoke the ${licenseId} license`, async () => {
        //act
        const result = await licenseService.revokeLicense(licenseId, 'success')

        //assert
        expect(result).toMatchObject({
          revokeSuccess: true,
        })
      })
      it(`should fail to revoke the ${licenseId}  license`, async () => {
        //act
        const result = await licenseService.revokeLicense(licenseId, 'failure')

        //assert
        expect(result).toMatchObject({
          revokeSuccess: false,
        })
      })
      it(`should throw user error on bad input when trying to revoke the ${licenseId} license`, async () => {
        //act
        const result = licenseService.revokeLicense(licenseId, '')

        //assert
        await expect(result).rejects.toThrow(
          new BadRequestException(['some user error']),
        )
      })
      it(`should throw server error when trying to revoke the ${licenseId} license with an invalid national id`, async () => {
        //act
        const result = licenseService.revokeLicense(licenseId, 'invalid')

        //assert
        await expect(result).rejects.toThrow(
          new InternalServerErrorException(['some service error']),
        )
      })
    })

    describe.each(Object.values(LicenseUpdateType))(
      'update %s',
      (licenseUpdateType) => {
        it(`should ${licenseUpdateType}-update the ${licenseId} license`, async () => {
          //act
          const result = await licenseService.updateLicense(
            licenseId,
            'success',
            {
              licenseUpdateType,
              expiryDate: '2022-01-01T00:00:00Z',
            },
          )

          //assert
          expect(result).toMatchObject({
            updateSuccess: true,
            data: undefined,
          })
        })
        it(`should throw user error on bad input when trying to ${licenseUpdateType}-update the ${licenseId} `, async () => {
          //act
          const result = licenseService.updateLicense(licenseId, '', {
            licenseUpdateType,
            expiryDate: '2022-01-01T00:00:00Z',
          })

          //assert
          await expect(result).rejects.toThrowError(
            new BadRequestException(['some user error']),
          )
        })
        it(`should throw server error when trying to ${licenseUpdateType}-update the ${licenseId} with an invalid national id `, async () => {
          //act
          const result = licenseService.updateLicense(licenseId, 'invalid', {
            licenseUpdateType,
            expiryDate: '2022-01-01T00:00:00Z',
          })

          //assert
          await expect(result).rejects.toThrowError(
            new InternalServerErrorException(['some service error']),
          )
        })
      },
    )
  })
})
