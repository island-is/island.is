import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  GenericLicenseFields,
  GenericUserLicenseFields,
} from './licenceService.type'
import { LicenseServiceApi } from './client'
import { drivingLicensesToSingleGenericLicense } from './util/licenseMappers'

export type GetGenericDrivingLicenseOptions = {
  includedProviders?: Array<string>
  excludedProviders?: Array<string>
  force?: boolean
  onlyList?: boolean
}

@Injectable()
export class LicenseServiceService {
  constructor(private readonly licenseService: LicenseServiceApi) {}

  async getAllLicenses(
    nationalId: User['nationalId'],
    {
      includedProviders,
      excludedProviders,
      force,
      onlyList,
    }: GetGenericDrivingLicenseOptions = {},
  ): Promise<GenericUserLicenseFields[]> {
    const drivingLicense = await this.licenseService.getGenericDrivingLicense(
      nationalId,
    )

    if (!drivingLicense) {
      // TODO how do we handle null?
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
    providerId: string,
    licenseType: string, // TODO actual type/enum
    licenseId: string,
  ): Promise<GenericUserLicenseFields | null> {
    const drivingLicense = await this.licenseService.getGenericDrivingLicense(
      nationalId,
    )

    if (!drivingLicense) {
      // TODO how do we handle null?
      throw Error(`unable to get drivers license for nationalId ${nationalId}`)
    }

    const genericDrivingLicense = drivingLicensesToSingleGenericLicense(
      drivingLicense,
    )
    console.log({ drivingLicense })

    return genericDrivingLicense
  }
}
