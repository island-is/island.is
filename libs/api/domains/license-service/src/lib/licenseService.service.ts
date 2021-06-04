import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { GenericUserLicense } from './licenceService.type'
import { LicenseServiceApi } from './client/driving-license-client'
import { drivingLicensesToSingleGenericLicense } from './client/driving-license-client/drivingLicenseMappers'

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
  ): Promise<GenericUserLicense[]> {
    const drivingLicense = await this.licenseService.getGenericDrivingLicense(
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
    providerId: string,
    licenseType: string, // TODO(osk) actual type/enum
    licenseId: string,
  ): Promise<GenericUserLicense | null> {
    const drivingLicense = await this.licenseService.getGenericDrivingLicense(
      nationalId,
    )

    if (!drivingLicense) {
      // TODO(osk) how do we handle null?
      throw Error(`unable to get drivers license for nationalId ${nationalId}`)
    }

    const genericDrivingLicense = drivingLicensesToSingleGenericLicense(
      drivingLicense,
    )
    console.log({ drivingLicense })

    return genericDrivingLicense
  }
}
