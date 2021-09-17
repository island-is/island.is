import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'
import add from 'date-fns/add'
import compareAsc from 'date-fns/compareAsc'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
  GENERIC_LICENSE_FACTORY,
  GenericLicenseType,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseUserdata,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseStatus,
  GenericLicenseCached,
  GenericLicenseUserdataExternal,
  PkPassVerification,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'

import { AVAILABLE_LICENSES } from './licenseService.module'

const CACHE_KEY = 'licenseService'

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
      cacheManager?: CacheManager,
    ) => Promise<GenericLicenseClient<unknown> | null>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async getCachedOrCache(
    license: GenericLicenseMetadata,
    nationalId: string,
    fetch: () => Promise<GenericLicenseUserdata | null>,
    ttl = 0,
  ): Promise<GenericLicenseCached> {
    const cacheKey = `${CACHE_KEY}_${license.type}_${nationalId}`

    if (ttl > 0) {
      const cachedData = await this.cacheManager.get(cacheKey)

      if (cachedData) {
        try {
          const data = JSON.parse(cachedData as string) as GenericLicenseCached

          const cacheMaxAge = add(data.fetch.updated, { seconds: ttl })
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

    const data = await fetch()

    if (!data) {
      this.logger.warn('No data for generic license returned', {
        license,
      })
      return {
        data: null,
        fetch: {
          status: GenericUserLicenseFetchStatus.Error,
          updated: new Date(),
        },
      }
    }

    const dataWithFetch: GenericLicenseCached = {
      data,
      fetch: {
        status: GenericUserLicenseFetchStatus.Fetched,
        updated: new Date(),
      },
    }

    try {
      await this.cacheManager.set(cacheKey, JSON.stringify(data), { ttl })
    } catch (e) {
      this.logger.warn('Unable to cache data for license', {
        license,
      })
    }

    return dataWithFetch
  }

  async getAllLicenses(
    nationalId: User['nationalId'],
    locale: Locale,
    {
      includedTypes,
      excludedTypes,
      force,
      onlyList,
    }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      let licenseDataFromService: GenericLicenseCached | null = null
      if (!onlyList) {
        const licenseService = await this.genericLicenseFactory(license.type)

        if (!licenseService) {
          this.logger.warn('No license service from generic license factory', {
            type: license.type,
            provider: license.provider,
          })
        } else {
          licenseDataFromService = await this.getCachedOrCache(
            license,
            nationalId,
            async () => await licenseService.getLicense(nationalId),
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

      const licenseUserdata = licenseDataFromService?.data ?? {
        status: GenericUserLicenseStatus.Unknown,
      }

      const fetch = licenseDataFromService?.fetch ?? {
        status: GenericUserLicenseFetchStatus.Error,
        updated: new Date(),
      }
      const combined: GenericUserLicense = {
        nationalId,
        license: {
          ...license,
          ...licenseUserdata,
        },
        fetch,
      }

      licenses.push(combined)
    }

    return licenses
  }

  async getLicense(
    nationalId: User['nationalId'],
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<GenericUserLicense> {
    let licenseUserdata: GenericLicenseUserdataExternal | null = null

    const license = AVAILABLE_LICENSES.find((i) => i.type === licenseType)
    const licenseService = await this.genericLicenseFactory(licenseType)

    if (license && licenseService) {
      licenseUserdata = await licenseService.getLicenseDetail(nationalId)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    return {
      nationalId,
      license: {
        ...license,
        status: licenseUserdata?.status ?? GenericUserLicenseStatus.Unknown,
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
    nationalId: User['nationalId'],
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    let pkPassUrl: string | null = null

    const licenseService = await this.genericLicenseFactory(licenseType)

    if (licenseService) {
      pkPassUrl = await licenseService.getPkPassUrl(nationalId)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    if (!pkPassUrl) {
      throw new Error(
        `Unable to get pkpass for ${licenseType} for nationalId ${nationalId}`,
      )
    }

    return pkPassUrl
  }

  async verifyPkPass(
    nationalId: User['nationalId'],
    locale: Locale,
    licenseType: GenericLicenseType,
    data: string,
  ): Promise<PkPassVerification> {
    let verification: PkPassVerification | null = null

    const licenseService = await this.genericLicenseFactory(licenseType)

    if (licenseService) {
      verification = await licenseService.verifyPkPass(data)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    if (!verification) {
      throw new Error(
        `Unable to verify pkpass for ${licenseType} for nationalId ${nationalId}`,
      )
    }

    return verification
  }
}
