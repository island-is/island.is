import { User } from '@island.is/auth-nest-tools'
import {
  LicenseClientService,
  LicenseType,
  LicenseVerifyExtraDataResult,
} from '@island.is/clients/license-client'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Locale } from '@island.is/shared/types'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShortUniqueId from 'short-unique-id'
import { GenericUserLicense } from './dto/GenericUserLicense.dto'
import {
  VerifyLicenseBarcodeError,
  VerifyLicenseBarcodeResult,
  VerifyLicenseBarcodeType,
} from './dto/VerifyLicenseBarcodeResult.dto'
import {
  GenericLicenseMapper,
  GenericLicenseType,
  GenericLicenseTypeType,
  GenericLicenseUserdata,
  GenericUserLicenseFetchStatus,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  LicenseTypeFetchResponse,
  PkPassVerification,
} from './licenceService.type'
import {
  AVAILABLE_LICENSES,
  DEFAULT_LICENSE_ID,
  LICENSE_MAPPER_FACTORY,
} from './licenseService.constants'
import { CreateBarcodeResult } from './dto/CreateBarcodeResult.dto'
import { isDefined } from '@island.is/shared/utils'
import { GenericLicenseError as LicenseError } from './dto/GenericLicenseError.dto'
import { LicenseCollection } from './dto/GenericLicenseCollection.dto'
import isAfter from 'date-fns/isAfter'
import { isJSON, isJWT } from 'class-validator'
import {
  BarcodeService,
  TOKEN_EXPIRED_ERROR,
} from '@island.is/services/license'
import { UserAgent } from '@island.is/nest/core'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

const LOG_CATEGORY = 'license-service'

export type GetGenericLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}

const { randomUUID } = new ShortUniqueId({ length: 16 })

const COMMON_VERIFY_ERROR = {
  valid: false,
  error: VerifyLicenseBarcodeError.ERROR,
}

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly barcodeService: BarcodeService,
    private readonly licenseClient: LicenseClientService,
    private readonly featureService: FeatureFlagService,
    @Inject(LICENSE_MAPPER_FACTORY)
    private readonly licenseMapperFactory: (
      type: GenericLicenseType,
    ) => Promise<GenericLicenseMapper | null>,
  ) {}

  /**
   * Maps the generic license type to the actual license type used by the license clients
   */
  private mapLicenseType = (type: GenericLicenseType) =>
    type === GenericLicenseType.DriversLicense
      ? LicenseType.DrivingLicense
      : (type as unknown as LicenseType)

  /**
   * Maps the client license type to the generic license type
   */
  private mapGenericLicenseType = (type: LicenseType) =>
    type === LicenseType.DrivingLicense
      ? GenericLicenseType.DriversLicense
      : (type as unknown as GenericLicenseType)

  async getLicenseCollection(
    user: User,
    locale: Locale,
    { includedTypes, excludedTypes, onlyList }: GetGenericLicenseOptions = {},
    userAgent?: UserAgent,
  ): Promise<LicenseCollection> {
    const fetchPromises = AVAILABLE_LICENSES.map(async (license) => {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        return null
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        return null
      }

      if (!onlyList) {
        return this.getLicensesOfType(user, locale, license.type, userAgent)
      }

      return null
    }).filter(isDefined)

    const licenses: Array<GenericUserLicense> = []
    const errors: Array<LicenseError> = []

    for (const licenseArrayResult of await Promise.allSettled(fetchPromises)) {
      if (
        licenseArrayResult.status === 'fulfilled' &&
        licenseArrayResult.value
      ) {
        const licenseResult = licenseArrayResult.value
        if (licenseResult.fetchResponseType === 'error') {
          errors.push(licenseResult.data)
        } else {
          licenses.push(...licenseResult.data)
        }
      }
    }

    return {
      licenses,
      errors,
    }
  }

  async getLicensesOfType(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
    agent?: UserAgent,
  ): Promise<LicenseTypeFetchResponse | null> {
    const licenseTypeDefinition = AVAILABLE_LICENSES.find(
      (i) => i.type === licenseType,
    )

    if (!licenseTypeDefinition) {
      this.logger.warn('Invalid license type supplied', {
        licenseType,
        category: LOG_CATEGORY,
      })
      return null
    }

    const mappedLicenseType = this.mapLicenseType(licenseTypeDefinition.type)

    const client = await this.getClient(mappedLicenseType)

    const licensesFetchResponse = await client.getLicenses(user)

    if (!licensesFetchResponse.ok) {
      return {
        fetchResponseType: 'error',
        data: {
          type: licenseType,
          fetch: {
            status: GenericUserLicenseFetchStatus.Error,
            updated: new Date().getTime().toString(),
          },
          code: licensesFetchResponse.error.code,
          message: licensesFetchResponse.error.message,
          extraData: licensesFetchResponse.error.data,
        },
      }
    }

    const mapper = await this.licenseMapperFactory(licenseTypeDefinition.type)

    if (!mapper) {
      this.logger.warn('Service failure. No mapper created', {
        licenseType,
        category: LOG_CATEGORY,
      })
      return null
    }

    const licensesPayload = await mapper.parsePayload(
      licensesFetchResponse.data,
      locale,
      agent,
    )

    const mappedLicenses: Array<GenericUserLicense> = await Promise.all(
      licensesPayload.map(async (lp) => {
        const licenseUserData: GenericLicenseUserdata = {
          status: GenericUserLicenseStatus.Unknown,
          pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
        }

        if (lp) {
          licenseUserData.pkpassStatus = client.clientSupportsPkPass
            ? ((await client.licenseIsValidForPkPass?.(
                lp.payload.rawData,
                user,
              )) as unknown as GenericUserLicensePkPassStatus) ??
              GenericUserLicensePkPassStatus.Unknown
            : GenericUserLicensePkPassStatus.NotAvailable
          licenseUserData.status = GenericUserLicenseStatus.HasLicense
        } else {
          licenseUserData.status = GenericUserLicenseStatus.NotAvailable
        }

        return {
          nationalId: user.nationalId,
          isOwnerChildOfUser: lp.type === 'child',
          license: {
            ...licenseTypeDefinition,
            status: licenseUserData.status,
            pkpassStatus: licenseUserData.pkpassStatus,
            name: lp.licenseName,
          },
          fetch: {
            status: GenericUserLicenseFetchStatus.Fetched,
            updated: new Date().getTime().toString(),
          },
          payload: {
            ...lp.payload,
            metadata: {
              ...lp.payload.metadata,
              expired: lp.payload.metadata?.expired ?? undefined,
              expireDate: lp.payload.metadata?.expireDate ?? undefined,
            },
            rawData: lp.payload.rawData ?? undefined,
          },
        }
      }),
    )

    return {
      fetchResponseType: 'licenses',
      data: mappedLicenses,
    }
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
    licenseId?: string,
    agent?: UserAgent,
  ): Promise<GenericUserLicense | LicenseError | null> {
    const licensesOfType = await this.getLicensesOfType(
      user,
      locale,
      licenseType,
      agent,
    )

    if (!licensesOfType) {
      return null
    }

    if (licensesOfType.fetchResponseType === 'error') {
      return licensesOfType.data
    }

    if (!licenseId || licenseId === DEFAULT_LICENSE_ID) {
      return licensesOfType.data[0] ?? null
    }

    const license =
      licensesOfType.data.find(
        (l) => l.payload?.metadata?.licenseId === licenseId,
      ) ?? null

    return license ?? null
  }

  async getClient<Type extends LicenseType>(type: LicenseType) {
    const client = await this.licenseClient.getClientByLicenseType<Type>(type)

    if (!client) {
      const msg = `Invalid license type. "${type}"`
      this.logger.warn(msg, { category: LOG_CATEGORY })

      throw new InternalServerErrorException(msg)
    }

    return client
  }

  async verifyPkPassDeprecated(data: string): Promise<PkPassVerification> {
    if (!data) {
      this.logger.warn('Missing input data for pkpass verification', {
        category: LOG_CATEGORY,
      })
      throw new Error(`Missing input data`)
    }

    const { passTemplateId }: { passTemplateId?: string } = JSON.parse(data)

    if (!passTemplateId) {
      throw new BadRequestException('Invalid pass template id supplied')
    }

    /*
     * PkPass barcodes provide a PassTemplateId that we can use to
     * map barcodes to license types.
     * Drivers licenses do NOT return a barcode so if the pass template
     * id is missing, then it's a driver's license.
     * Otherwise, map the id to its corresponding license type
     */
    const licenseService = await this.licenseClient.getClientByPassTemplateId(
      passTemplateId,
    )

    if (!licenseService) {
      throw new Error(`Invalid pass template id: ${passTemplateId}`)
    }

    if (!licenseService.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        passTemplateId,
      })
      throw new BadRequestException(
        `License client does not support pkpass, passTemplateId: ${passTemplateId}`,
      )
    }

    if (licenseService.verifyPkPassDeprecated) {
      const verification = await licenseService.verifyPkPassDeprecated(data)

      if (!verification.ok) {
        throw new InternalServerErrorException(
          'Unable to verify pkpass for user',
        )
      }

      return verification.data
    }

    if (licenseService.verifyPkPass) {
      const verifyPkPassRes = await licenseService.verifyPkPass(data)

      if (!verifyPkPassRes.ok) {
        throw new InternalServerErrorException(
          `Unable to verify pkpass for user`,
        )
      }

      return {
        valid: verifyPkPassRes.data.valid,
        // Make sure to return the data as a string to be backwards compatible
        data: JSON.stringify(verifyPkPassRes.data.data),
      }
    }

    const missingMethodMsg =
      'License client has no verifyPkPass nor verifyPkPassDeprecated implementation'
    this.logger.error(missingMethodMsg, {
      passTemplateId,
    })

    throw new BadRequestException(
      `${missingMethodMsg}, passTemplateId: ${passTemplateId}`,
    )
  }

  getBarcodeSessionKey(licenseType: LicenseType, sub: string) {
    return `${licenseType}-${sub}`
  }

  async checkBarcodeSession(
    barcodeSessionKey: string | undefined,
    user: User,
    licenseType: LicenseType,
  ) {
    if (barcodeSessionKey) {
      const activeBarcodeSession = await this.barcodeService.getSessionCache(
        barcodeSessionKey,
      )

      if (activeBarcodeSession && activeBarcodeSession !== user.sid) {
        // If the user has an active session for the license type, we should not create a new barcode
        this.logger.info('User has an active session for license', {
          licenseType,
        })

        throw new ProblemError({
          type: ProblemType.BAD_SESSION,
          title: `User has an active session for license type: ${licenseType}`,
        })
      }
    }
  }

  async createBarcode(
    user: User,
    genericUserLicense: GenericUserLicense,
  ): Promise<CreateBarcodeResult | null> {
    const code = randomUUID()
    const genericUserLicenseType = genericUserLicense.license.type
    const licenseType = this.mapLicenseType(genericUserLicenseType)
    const client = await this.getClient<typeof licenseType>(licenseType)

    const barcodeSessionKey = user.sub
      ? this.getBarcodeSessionKey(licenseType, user.sub)
      : undefined

    await this.checkBarcodeSession(barcodeSessionKey, user, licenseType)

    if (
      genericUserLicense.license.pkpassStatus !==
      GenericUserLicensePkPassStatus.Available
    ) {
      this.logger.info(
        `pkpassStatus not available for license: ${licenseType}`,
        {
          pkpassStatus: genericUserLicense.license.pkpassStatus,
        },
      )

      return null
    }

    let extraData: LicenseVerifyExtraDataResult<LicenseType> | undefined

    if (client?.verifyExtraData) {
      extraData = await client.verifyExtraData(user)

      if (!extraData) {
        const msg = `Unable to verify extra data for license: ${licenseType}`
        this.logger.error(msg, { category: LOG_CATEGORY })

        throw new InternalServerErrorException(msg)
      }
    }

    const [tokenPayload] = await Promise.all([
      // Create a token with the version and a server reference (Redis key) code
      this.barcodeService.createToken({
        v: VerifyLicenseBarcodeType.V2,
        t: licenseType,
        c: code,
      }),
      // Store license data in cache so that we can fetch data quickly when verifying the barcode
      this.barcodeService.setCache(code, {
        nationalId: user.nationalId,
        licenseType,
        extraData,
      }),
      barcodeSessionKey &&
        user.sid &&
        this.barcodeService.setSessionCache(barcodeSessionKey, user.sid),
    ])

    return tokenPayload
  }

  logWarn(msg: string) {
    this.logger.warn(msg, {
      category: LOG_CATEGORY,
    })
  }

  async getDataFromToken(token: string) {
    let code: string | undefined

    try {
      const payload = await this.barcodeService.verifyToken(token)
      code = payload.c
    } catch (error) {
      this.logger.warn(error, {
        category: LOG_CATEGORY,
      })

      if (error.name === TOKEN_EXPIRED_ERROR) {
        // If the token is expired, we can still get the token payload by ignoring the expiration date
        const { t: licenseType } = await this.barcodeService.verifyToken(
          token,
          {
            ignoreExpiration: true,
          },
        )

        return {
          licenseType: this.mapGenericLicenseType(licenseType),
          valid: false,
          error: VerifyLicenseBarcodeError.EXPIRED,
        }
      }

      return COMMON_VERIFY_ERROR
    }

    const data = await this.barcodeService.getCache(code)

    if (!data) {
      this.logWarn('No data found in cache')

      return COMMON_VERIFY_ERROR
    }

    const licenseType = this.mapGenericLicenseType(data.licenseType)

    return {
      valid: true,
      licenseType,
      data: data.extraData
        ? {
            ...data.extraData,
            // type here is used to resolve the union type in the graphql schema
            type: licenseType,
          }
        : null,
    }
  }

  async verifyLicenseBarcode(
    data: string,
  ): Promise<VerifyLicenseBarcodeResult> {
    if (isJWT(data)) {
      // Verify the barcode data as a token, e.g. new barcode format
      const tokenData = await this.getDataFromToken(data)

      if (
        'licenseType' in tokenData &&
        tokenData.licenseType !== GenericLicenseType.DriversLicense
      ) {
        return {
          barcodeType: VerifyLicenseBarcodeType.V2,
          licenseType: tokenData.licenseType,
          valid: false,
          error: VerifyLicenseBarcodeError.ERROR,
        }
      }

      return {
        barcodeType: VerifyLicenseBarcodeType.V2,
        ...tokenData,
      }
    }

    // else fallback to the old barcode format

    if (!isJSON(data)) {
      this.logWarn('Invalid JSON data')

      return {
        barcodeType: VerifyLicenseBarcodeType.UNKNOWN,
        ...COMMON_VERIFY_ERROR,
      }
    }

    const {
      passTemplateId,
      expires,
      date,
    }: { passTemplateId?: string; expires?: string; date?: string } =
      JSON.parse(data)

    if (!passTemplateId) {
      this.logWarn('No passTemplateId found in data')

      return {
        barcodeType: VerifyLicenseBarcodeType.UNKNOWN,
        ...COMMON_VERIFY_ERROR,
      }
    }

    const client = await this.licenseClient.getClientByPassTemplateId(
      passTemplateId,
    )

    if (!client) {
      this.logWarn(
        'Invalid passTemplateId supplied to getClientByPassTemplateId',
      )

      return {
        barcodeType: VerifyLicenseBarcodeType.PK_PASS,
        ...COMMON_VERIFY_ERROR,
      }
    }

    const licenseType = this.mapGenericLicenseType(client.type)
    const commonResult = {
      licenseType,
      barcodeType: VerifyLicenseBarcodeType.PK_PASS,
    }
    const parsedExpireTime = expires || date

    // If the expiration date is in the past, the barcode is expired
    if (parsedExpireTime && !isAfter(new Date(parsedExpireTime), new Date())) {
      return {
        ...commonResult,
        valid: false,
        error: VerifyLicenseBarcodeError.EXPIRED,
      }
    }

    if (!client.verifyPkPass) {
      this.logWarn('License client has no verifyPkPass implementation')

      return {
        ...commonResult,
        ...COMMON_VERIFY_ERROR,
      }
    }

    const res = await client.verifyPkPass(data)

    if (!res.ok) {
      this.logWarn('Unable to verify pkpass for user')

      return {
        ...commonResult,
        ...COMMON_VERIFY_ERROR,
      }
    }

    const licenseData = res.data.data

    return {
      ...commonResult,
      valid: true,
      data: licenseData
        ? {
            type: licenseType,
            ...licenseData,
          }
        : null,
    }
  }
}
