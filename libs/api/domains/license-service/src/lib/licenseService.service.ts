import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'

import { GenericDrivingLicenseApi } from './client/driving-license-client'

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
  (!includedTypes || (includedTypes && includedTypes.includes(type))) &&
  (!excludedTypes || (excludedTypes && !excludedTypes.includes(type)))

@Injectable()
export class LicenseServiceService {
  constructor(
    private readonly drivingLicenseService: GenericDrivingLicenseApi,
  ) {}

  private async getDriversLicense(
    nationalId: User['nationalId'],
    force?: boolean,
  ) {
    let drivingLicense: GenericUserLicense | null = null
      drivingLicense = await this.drivingLicenseService.getGenericDrivingLicense(
        nationalId,
      )

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
