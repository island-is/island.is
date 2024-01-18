import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { CmsContentfulService } from '@island.is/cms'
import {
  GenericLicenseTypeType,
  GenericLicenseType,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  GenericUserLicensePkPassStatus,
  GenericLicenseOrganizationSlug,
  GenericLicenseUserdata,
  GenericLicenseFetchResult,
  LICENSE_MAPPER_FACTORY,
  GenericLicenseMapper,
  DEFAULT_LICENSE_ID,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'
import {
  LicenseClient,
  LicenseClientService,
  LicenseType,
} from '@island.is/clients/license-client'
import { AVAILABLE_LICENSES } from './licenseService.module'
import {
  UserLicensesResponse,
  GenericUserLicense,
} from './graphql/genericLicense.model'

const LOG_CATEGORY = 'license-service'

export type GetGenericLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}
@Injectable()
export class LicenseServiceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly licenseClient: LicenseClientService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LICENSE_MAPPER_FACTORY)
    private readonly licenseMapperFactory: (
      type: GenericLicenseType,
    ) => Promise<GenericLicenseMapper | null>,
  ) {}

  private async getOrganization(
    slug: GenericLicenseOrganizationSlug,
    locale: Locale,
  ) {
    const organization = await this.cmsContentfulService.getOrganization(
      slug,
      locale,
    )

    return organization
  }

  //backwards compatibilty hax
  private mapLicenseType = (type: GenericLicenseType) =>
    this.licenseClient.getClientByLicenseType(
      type === GenericLicenseType.DriversLicense
        ? LicenseType.DrivingLicense
        : (type as unknown as LicenseType),
    )

  private async getLicenseLabels(locale: Locale) {
    const licenseLabels = await this.cmsContentfulService.getNamespace(
      'Licenses',
      locale,
    )

    return {
      labels: licenseLabels?.fields
        ? JSON.parse(licenseLabels?.fields)
        : undefined,
    }
  }

  private async fetchLicenses(
    user: User,
    licenseClient: LicenseClient<unknown>,
  ): Promise<GenericLicenseFetchResult> {
    if (!licenseClient) {
      throw new InternalServerErrorException('License service failed')
    }

    const licenseRes = await licenseClient.getLicenses(user)

    if (!licenseRes.ok) {
      return {
        data: [],
        fetch: {
          status: GenericUserLicenseFetchStatus.Error,
          updated: new Date(),
        },
      }
    }

    return {
      data: licenseRes.data,
      fetch: {
        status: GenericUserLicenseFetchStatus.Fetched,
        updated: new Date(),
      },
    }
  }

  async getUserLicenses(
    user: User,
    locale: Locale,
    { includedTypes, excludedTypes, onlyList }: GetGenericLicenseOptions = {},
  ): Promise<UserLicensesResponse> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      if (!onlyList) {
        const genericLicenses = await this.getLicensesOfType(
          user,
          locale,
          license.type,
        )

        genericLicenses
          ?.filter(
            (gl) => gl.license.status === GenericUserLicenseStatus.HasLicense,
          )
          .forEach((gl) => licenses.push(gl))
      }
    }
    return {
      nationalId: user.nationalId,
      licenses: licenses ?? [],
    }
  }
  async getAllLicenses(
    user: User,
    locale: Locale,
    { includedTypes, excludedTypes, onlyList }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      if (!onlyList) {
        const genericLicenses = await this.getLicensesOfType(
          user,
          locale,
          license.type,
        )

        genericLicenses
          ?.filter(
            (gl) => gl.license.status === GenericUserLicenseStatus.HasLicense,
          )
          .forEach((gl) => licenses.push(gl))
      }
    }
    return licenses
  }

  async getLicensesOfType(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<Array<GenericUserLicense> | null> {
    const licenseTypeDefinition = AVAILABLE_LICENSES.find(
      (i) => i.type === licenseType,
    )

    const licenseService = await this.mapLicenseType(licenseType)

    if (!licenseTypeDefinition || !licenseService) {
      this.logger.error(`Invalid license type. type: ${licenseType}`, {
        category: LOG_CATEGORY,
      })
      return null
    }

    const orgData = licenseTypeDefinition.orgSlug
      ? await this.getOrganization(licenseTypeDefinition.orgSlug, locale)
      : undefined
    const licenseLabels = await this.getLicenseLabels(locale)
    const licenseRes = await this.fetchLicenses(user, licenseService)

    const mapper = await this.licenseMapperFactory(licenseType)

    if (!mapper) {
      this.logger.warn('Service failure. No mapper created', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const licensesPayload =
      licenseRes.fetch.status !== GenericUserLicenseFetchStatus.Error
        ? mapper.parsePayload(licenseRes.data, locale, licenseLabels)
        : []

    const mappedLicenses = licensesPayload.map((lp) => {
      const licenseUserData: GenericLicenseUserdata = {
        status: GenericUserLicenseStatus.Unknown,
        pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
      }

      if (lp) {
        licenseUserData.pkpassStatus = licenseService.clientSupportsPkPass
          ? (licenseService.licenseIsValidForPkPass?.(
              licenseRes.data,
            ) as unknown as GenericUserLicensePkPassStatus) ??
            GenericUserLicensePkPassStatus.Unknown
          : GenericUserLicensePkPassStatus.NotAvailable
        licenseUserData.status = GenericUserLicenseStatus.HasLicense
      } else {
        licenseUserData.status = GenericUserLicenseStatus.NotAvailable
      }

      return {
        nationalId: user.nationalId,
        license: {
          ...licenseTypeDefinition,
          status: licenseUserData.status,
          pkpassStatus: licenseUserData.pkpassStatus,
          title: orgData?.title,
          logo: orgData?.logo?.url,
        },
        fetch: {
          ...licenseRes.fetch,
          updated: licenseRes.fetch.updated.getTime().toString(),
        },
        payload:
          {
            ...lp,
            rawData: lp.rawData ?? undefined,
          } ?? undefined,
      }
    })

    return (
      mappedLicenses ?? [
        {
          nationalId: user.nationalId,
          license: {
            ...licenseTypeDefinition,
            status: GenericUserLicenseStatus.Unknown,
            pkpassStatus: GenericUserLicenseStatus.Unknown,
            title: orgData?.title,
            logo: orgData?.logo?.url,
          },
          fetch: {
            ...licenseRes.fetch,
            updated: licenseRes.fetch.updated.getTime().toString(),
          },
          payload: undefined,
        },
      ]
    )
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
    licenseId?: string,
  ): Promise<GenericUserLicense | null> {
    const licensesOfType =
      (await this.getLicensesOfType(user, locale, licenseType)) ?? []

    if (!licenseId || licenseId === DEFAULT_LICENSE_ID) {
      return licensesOfType[0] ?? null
    }

    return (
      licensesOfType.find(
        (l) => l.payload?.metadata?.licenseId === licenseId,
      ) ?? null
    )
  }

  async generatePkPassUrl(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<string> {
    const client = await this.mapLicenseType(licenseType)

    if (!client) {
      this.logger.warn(`Invalid license type. type: ${licenseType}`, {
        category: LOG_CATEGORY,
      })
      throw new InternalServerErrorException(
        `Invalid license type. type: ${licenseType}`,
      )
    }
    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassUrl) {
      this.logger.error('License client has no getPkPassUrl implementation', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client has no getPkPassUrl implementation, type: ${licenseType}`,
      )
    }

    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassUrl) {
      this.logger.error('License client has no getPkPassUrl implementation', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client has no getPkPassUrl implementation, type: ${licenseType}`,
      )
    }

    const pkPassRes = await client.getPkPassUrl(user)

    if (pkPassRes.ok) {
      return pkPassRes.data
    }

    throw new InternalServerErrorException(
      `Unable to get pkpass for ${licenseType} for user`,
    )
  }

  async generatePkPassQRCode(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<string> {
    const client = await this.mapLicenseType(licenseType)

    if (!client) {
      this.logger.warn(`Invalid license type. type: ${licenseType}`, {
        category: LOG_CATEGORY,
      })
      throw new InternalServerErrorException(
        `Invalid license type. type: ${licenseType}`,
      )
    }

    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassQRCode) {
      this.logger.error(
        'License client has no getPkPassQRCode implementation',
        {
          category: LOG_CATEGORY,
          type: licenseType,
        },
      )
      throw new BadRequestException(
        `License client has no getPkPassQRCode implementation, type: ${licenseType}`,
      )
    }

    const pkPassRes = await client.getPkPassQRCode(user)

    if (pkPassRes.ok) {
      return pkPassRes.data
    }

    throw new InternalServerErrorException(
      `Unable to get pkpass for ${licenseType} for user`,
    )
  }

  async verifyPkPass(data: string): Promise<PkPassVerification> {
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
     * id is missing, then it's a drivers license.
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

    if (!licenseService.verifyPkPass) {
      this.logger.error('License client has no verifyPkPass implementation', {
        category: LOG_CATEGORY,
        passTemplateId,
      })
      throw new BadRequestException(
        `License client has no verifyPkPass implementation, passTemplateId: ${passTemplateId}`,
      )
    }

    const verification = await licenseService.verifyPkPass(data, passTemplateId)

    // TODO BETTER ERROR HANDLING
    if (!verification.ok) {
      throw new Error(`Unable to verify pkpass for user`)
    }
    return verification.data
  }
}
