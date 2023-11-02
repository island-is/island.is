import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { LicenseService } from '../license.service'
import {
  LicenseId,
  LicenseUpdateType,
  PASS_TEMPLATE_IDS,
} from '../license.types'
import {
  PassDataInput,
  Result,
  Pass,
  RevokePassData,
  VerifyPassData,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { VerifyInputData } from '../dto/verifyLicense.input'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import {
  BaseLicenseUpdateClient,
  LicenseUpdateClientService,
} from '@island.is/clients/license-client'

const licenseIds = Object.values(LicenseId)

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
  let licenseService: LicenseService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LicenseService,
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            debug: () => ({}),
            error: () => ({}),
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
      ],
    }).compile()

    licenseService = moduleRef.get<LicenseService>(LicenseService)
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
