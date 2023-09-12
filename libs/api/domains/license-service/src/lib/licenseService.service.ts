import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'
import add from 'date-fns/add'
import compareAsc from 'date-fns/compareAsc'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { CmsContentfulService } from '@island.is/cms'
import { DriversLicenseClientTypes } from './licenceService.type'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
  GENERIC_LICENSE_FACTORY,
  GenericLicenseType,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseStatus,
  GenericLicenseCached,
  GenericLicenseUserdataExternal,
  PkPassVerification,
  GenericUserLicensePkPassStatus,
  GenericLicenseOrganizationSlug,
  GenericLicenseLabels,
  CONFIG_PROVIDER,
} from './licenceService.type'
import type { PassTemplateIds } from './licenceService.type'
import { Locale } from '@island.is/shared/types'
import { AVAILABLE_LICENSES } from './licenseService.module'
import { FetchError } from '@island.is/clients/middlewares'

const CACHE_KEY = 'licenseService'
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
    @Inject(GENERIC_LICENSE_FACTORY)
    private genericLicenseFactory: (
      type: GenericLicenseType,
      user: User,
      forceSpecificDriversLicenseClient?: DriversLicenseClientTypes,
    ) => Promise<GenericLicenseClient<unknown> | null>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CONFIG_PROVIDER) private config: PassTemplateIds,
    private readonly cmsContentfulService: CmsContentfulService,
  ) {}

  private handleError(
    licenseType: GenericLicenseType,
    error: Partial<FetchError>,
  ): unknown {
    this.logger.warn(`${licenseType} fetch failed`, {
      exception: error,
      message: (error as Error)?.message,
      category: LOG_CATEGORY,
    })

    return null
  }

  private async getCachedOrCache(
    license: GenericLicenseMetadata,
    user: User,
    fetch: () => Promise<GenericLicenseUserdataExternal | null>,
    ttl = 0,
  ): Promise<GenericLicenseCached> {
    const cacheKey = `${CACHE_KEY}_${license.type}_${user.nationalId}`

    if (ttl > 0) {
      const cachedData = await this.cacheManager.get(cacheKey)

      if (cachedData) {
        try {
          const data = JSON.parse(cachedData as string) as GenericLicenseCached
          const cacheMaxAge = add(new Date(data.fetch.updated), {
            seconds: ttl,
          })
          if (compareAsc(cacheMaxAge, new Date()) < 0) {
            data.fetch.status = GenericUserLicenseFetchStatus.Stale
          }
        } catch (e) {
          this.logger.warn('Unable to parse cached data for license', {
            license,
          })
          // fall through to actual fetch of fresh fresh data
        }
      }
    }

    let fetchedData
    try {
      fetchedData = await fetch()

      if (!fetchedData) {
        return {
          data: null,
          fetch: {
            status: GenericUserLicenseFetchStatus.Fetched,
            updated: new Date(),
          },
          payload: undefined,
        }
      }
    } catch (e) {
      this.handleError(license.type, e)
      return {
        data: null,
        fetch: {
          status: GenericUserLicenseFetchStatus.Error,
          updated: new Date(),
        },
        payload: undefined,
      }
    }

    const { payload, ...userData } = fetchedData

    const dataWithFetch: GenericLicenseCached = {
      data: userData,
      fetch: {
        status: GenericUserLicenseFetchStatus.Fetched,
        updated: new Date(),
      },
      payload: payload ?? undefined,
    }

    try {
      await this.cacheManager.set(
        cacheKey,
        JSON.stringify(dataWithFetch),
        ttl * 1000,
      )
    } catch (e) {
      this.logger.warn('Unable to cache data for license', {
        license,
      })
    }

    return dataWithFetch
  }

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

  async getAllLicenses(
    user: User,
    locale: Locale,
    {
      includedTypes,
      excludedTypes,
      force,
      onlyList,
    }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }
      let licenseDataFromService: GenericLicenseCached | null = null
      const licenseLabels: GenericLicenseLabels = await this.getLicenseLabels(
        locale,
      )

      if (!onlyList) {
        const licenseService = await this.genericLicenseFactory(
          license.type,
          user,
        )

        if (!licenseService) {
          this.logger.warn('No license service from generic license factory', {
            type: license.type,
            provider: license.provider,
          })
        } else {
          licenseDataFromService = await this.getCachedOrCache(
            license,
            user,
            async () =>
              await licenseService.getLicense(user, locale, licenseLabels),
            force ? 0 : license.timeout,
          )

          if (!licenseDataFromService) {
            this.logger.warn('No license data returned from service', {
              type: license.type,
              provider: license.provider,
            })
          }
        }
      }

      /*
      //TODO - Máni (thorkellmani @ github)
      //Re-implement when app has updated their GenericUserLicenseStatus logic!!!
      const isDataFetched =
        licenseDataFromService?.fetch?.status ===
        GenericUserLicenseFetchStatus.Fetched

      const licenseUserData = licenseDataFromService?.data ?? {
        status: isDataFetched
          ? GenericUserLicenseStatus.NotAvailable
          : GenericUserLicenseStatus.Unknown,
        pkpassStatus: isDataFetched
          ? GenericUserLicensePkPassStatus.NotAvailable
          : GenericUserLicensePkPassStatus.Unknown,
      }
      */

      const licenseUserData = licenseDataFromService?.data ?? {
        status: GenericUserLicenseStatus.Unknown,
        pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
      }

      const fetch = licenseDataFromService?.fetch ?? {
        status: GenericUserLicenseFetchStatus.Error,
        updated: new Date(),
      }
      const combined: GenericUserLicense = {
        nationalId: user.nationalId,
        license: {
          ...license,
          ...licenseUserData,
        },
        fetch,
        payload: licenseDataFromService?.payload ?? undefined,
      }
      licenses.push(combined)
    }
    return licenses
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<GenericUserLicense> {
    let licenseUserdata: GenericLicenseUserdataExternal | null = null

    const license = AVAILABLE_LICENSES.find((i) => i.type === licenseType)
    const licenseService = await this.genericLicenseFactory(licenseType, user)

    const licenseLabels = await this.getLicenseLabels(locale)

    if (license && licenseService) {
      licenseUserdata = await licenseService.getLicenseDetail(
        user,
        locale,
        licenseLabels,
      )
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    const orgData = license.orgSlug
      ? await this.getOrganization(license.orgSlug, locale)
      : undefined

    return {
      nationalId: user.nationalId,
      license: {
        ...license,
        status: licenseUserdata?.status ?? GenericUserLicenseStatus.Unknown,
        pkpassStatus:
          licenseUserdata?.pkpassStatus ??
          GenericUserLicensePkPassStatus.Unknown,
        title: orgData?.title,
        logo: orgData?.logo?.url,
      },
      fetch: {
        status: licenseUserdata
          ? GenericUserLicenseFetchStatus.Fetched
          : GenericUserLicenseFetchStatus.Error,
        updated: new Date(),
      },
      payload: licenseUserdata?.payload ?? undefined,
    }
  }

  async generatePkPass(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    let pkpassUrl: string | null = null

    const licenseService = await this.genericLicenseFactory(licenseType, user)

    if (licenseService) {
      pkpassUrl = await licenseService.getPkPassUrl(user, licenseType, locale)
    } else {
      this.logger.warn('Invalid license type for pkpass generation', {
        category: LOG_CATEGORY,
      })
      throw new Error(`${licenseType} not supported`)
    }

    if (!pkpassUrl) {
      throw new Error(`Unable to get pkpass url for ${licenseType} for user`)
    }
    return { pkpassUrl }
  }

  async generatePkPassQrCode(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    let pkpassQRCode: string | null = null

    const licenseService = await this.genericLicenseFactory(licenseType, user)

    if (licenseService) {
      pkpassQRCode = await licenseService.getPkPassQRCode(
        user,
        licenseType,
        locale,
      )
    } else {
      this.logger.warn('Invalid license type for pkpass generation', {
        category: LOG_CATEGORY,
      })
      throw new Error(`${licenseType} not supported`)
    }
    if (!pkpassQRCode) {
      throw new Error(
        `Unable to get pkpass qr code for ${licenseType} for user`,
      )
    }

    return { pkpassQRCode }
  }

  async verifyPkPass(
    user: User,
    locale: Locale,
    data: string,
  ): Promise<PkPassVerification> {
    let verification: PkPassVerification | null = null

    if (!data) {
      this.logger.warn('Missing input data for pkpass verification', {
        category: LOG_CATEGORY,
      })
      throw new Error(`Missing input data`)
    }

    const { passTemplateId }: { passTemplateId?: string } = JSON.parse(data)

    /*
     * PkPass barcodes provide a PassTemplateId that we can use to
     * map barcodes to license types.
     * Drivers licenses do NOT return a barcode so if the pass template
     * id is missing, then it's a drivers license.
     * Otherwise, map the id to its corresponding license type
     */

    const licenseType = passTemplateId
      ? this.getTypeFromPassTemplateId(passTemplateId)
      : GenericLicenseType.DriversLicense

    if (!licenseType) {
      this.logger.warn('Invalid pass template id for pkpass verification', {
        category: LOG_CATEGORY,
      })
      throw new Error(`Invalid pass template id: ${passTemplateId}`)
    }

    // Temporariy flag until every user has the new digital driving license
    // We have to make the driving license client decision dependant on the barcode
    // being scanned. The simplest way for that is to add a force flag so we can make the
    // decision based on input rather than the authenticated user's license

    let forceDriversLicenseClient: DriversLicenseClientTypes | undefined =
      undefined

    if (licenseType === GenericLicenseType.DriversLicense) {
      forceDriversLicenseClient = passTemplateId ? 'new' : 'old'
    }

    const licenseService = await this.genericLicenseFactory(
      licenseType,
      user,
      forceDriversLicenseClient,
    )

    if (licenseService) {
      verification = await licenseService.verifyPkPass(data)
    } else {
      this.logger.warn('Invalid license type for pkpass verifcation', {
        category: LOG_CATEGORY,
      })
      throw new Error(`${licenseType} not supported`)
    }

    if (!verification) {
      this.logger.warn('pkpass verification failed', {
        category: LOG_CATEGORY,
      })
      throw new Error(`Unable to verify pkpass for ${licenseType} for user`)
    }
    return verification
  }

  private getTypeFromPassTemplateId(
    passTemplateId: string,
  ): GenericLicenseType | null {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === passTemplateId) {
        // firearmLicense => FirearmLicense
        const keyAsEnumKey = key.slice(0, 1).toUpperCase() + key.slice(1)

        //temporariy fix for the drivers licenses
        //pr currently under review that fixes this
        const valueFromEnum: GenericLicenseType | undefined =
          keyAsEnumKey === 'DrivingLicense'
            ? GenericLicenseType.DriversLicense
            : GenericLicenseType[keyAsEnumKey as GenericLicenseTypeType]

        if (!valueFromEnum) {
          this.logger.warn('Invalid license type in verication input', {
            category: LOG_CATEGORY,
          })
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }
}
