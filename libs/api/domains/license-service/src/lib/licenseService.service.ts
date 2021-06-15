import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { GenericUserLicense } from './licenceService.type'
import { GenericDrivingLicenseApi } from './client/driving-license-client'
import { drivingLicensesToSingleGenericLicense } from './client/driving-license-client/drivingLicenseMappers'
import { Locale } from '@island.is/shared/types'

export type GetGenericDrivingLicenseOptions = {
  includedProviders?: Array<string>
  excludedProviders?: Array<string>
  force?: boolean
  onlyList?: boolean
}

@Injectable()
export class LicenseServiceService {
  constructor(
    private readonly drivingLicenseService: GenericDrivingLicenseApi,
  ) {}

  async getAllLicenses(
    nationalId: User['nationalId'],
    locale: Locale,
    {
      includedProviders,
      excludedProviders,
      force,
      onlyList,
    }: GetGenericDrivingLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    console.log(includedProviders)
    const licenses: GenericUserLicense[] = []

    const drivingLicense = await this.drivingLicenseService.getGenericDrivingLicense(
      nationalId,
    )

    if (!drivingLicense) {
      // TODO(osk) how do we handle null?
      throw Error(`unable to get drivers license for nationalId ${nationalId}`)
    }

    const genericDrivingLicense = drivingLicensesToSingleGenericLicense(
      drivingLicense,
    )

    if (!genericDrivingLicense) {
      return []
    }

    return [genericDrivingLicense]
  }

  async getLicense(
    nationalId: User['nationalId'],
    locale: Locale,
    providerId: string,
    licenseType: string, // TODO(osk) actual type/enum
    licenseId: string,
  ): Promise<GenericUserLicense | null> {
    const drivingLicense = await this.drivingLicenseService.getGenericDrivingLicense(
      nationalId,
    )

    if (!drivingLicense) {
      // TODO(osk) how do we handle null?
      throw Error(`unable to get drivers license for nationalId ${nationalId}`)
    }

    const genericDrivingLicense = drivingLicensesToSingleGenericLicense(
      drivingLicense,
    )

    return genericDrivingLicense
  }
}
