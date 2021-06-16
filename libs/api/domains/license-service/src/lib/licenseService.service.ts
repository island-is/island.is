import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'

import { GenericDrivingLicenseApi } from './client/driving-license-client'

const CACHE_KEY = 'licenseService'
const ONE_DAY = 24 * 60 * 60

export type GetGenericDrivingLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}

const includeType = (
  type: GenericLicenseTypeType,
  includedTypes?: Array<GenericLicenseTypeType>,
  excludedTypes?: Array<GenericLicenseTypeType>,
) =>
  (!includedTypes || includedTypes.includes(type)) &&
  (!excludedTypes || !excludedTypes.includes(type))

@Injectable()
export class LicenseServiceService {
  constructor(
    private readonly drivingLicenseService: GenericDrivingLicenseApi,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private getCacheKey(
    nationalId: string,
    type: GenericLicenseTypeType,
  ): string {
    return `${CACHE_KEY}_${type}_${nationalId}`
  }

  private async setCache<T>(
    key: string,
    value: T,
    ttl: number = ONE_DAY,
  ): Promise<void> {
    await this.cacheManager.set(key, JSON.stringify(value), { ttl })
  }

  private async getCache<T>(cacheKey: string): Promise<T | null> {
    const cachedData = await this.cacheManager.get(cacheKey)
    if (!cachedData) {
      return null
    }

    return JSON.parse(cachedData as string)
  }

  private async getDriversLicense(
    nationalId: User['nationalId'],
    force?: boolean,
  ) {
    const key = this.getCacheKey(nationalId, 'DriversLicense')
    let drivingLicense: GenericUserLicense | null = null
    const cached = !force ? await this.getCache(key) : null
    if (!cached) {
      drivingLicense = await this.drivingLicenseService.getGenericDrivingLicense(
        nationalId,
      )
      if (drivingLicense) {
        this.setCache(key, drivingLicense)
      }
    } else {
      drivingLicense = cached as GenericUserLicense
    }

    if (!drivingLicense) {
      this.logger.error(
        `Unable to get DriversLicense for nationalId ${nationalId}`,
      )
      return null
    }

    return drivingLicense
  }

  async getAllLicenses(
    nationalId: User['nationalId'],
    locale: Locale,
    {
      includedTypes,
      excludedTypes,
      force,
      onlyList,
    }: GetGenericDrivingLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    console.log(includedTypes)
    const licenses: GenericUserLicense[] = []

    if (includeType('DriversLicense', includedTypes, excludedTypes)) {
      const drivingLicense = await this.getDriversLicense(nationalId, force)
      if (drivingLicense) {
        licenses.push(drivingLicense)
      }
    }

    return licenses
  }

  async getLicense(
    nationalId: User['nationalId'],
    locale: Locale,
    licenseType: GenericLicenseTypeType,
    licenseId: string,
  ): Promise<GenericUserLicense | null> {
    let license: GenericUserLicense | null = null

    if (licenseType === 'DriversLicense') {
      license = await this.getDriversLicense(nationalId, true)
    }

    if (licenseType !== 'DriversLicense') {
      throw new Error(`${licenseType} not supported yet`)
    }

    if (!license) {
      throw new Error(
        `Unable to get ${licenseType} ${licenseId} for nationalId ${nationalId}`,
      )
    }

    // TODO(osk) how do we handle null?
    return license
  }
}
