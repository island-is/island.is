import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { DrivingLicense } from './drivingLicense.type'
import { DrivingLicenseApi, DrivingLicenseResponse } from './client'

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  async getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicense> {
    const drivingLicenses = await this.drivingLicenseApi.getDrivingLicenses(
      nationalId,
    )

    if (drivingLicenses.length <= 0) {
      return null
    }

    drivingLicenses.sort(
      (a: DrivingLicenseResponse, b: DrivingLicenseResponse) =>
        new Date(b.utgafuDagsetning).getTime() -
        new Date(a.utgafuDagsetning).getTime(),
    )
    const activeDrivingLicense = {
      erBradabirgda: false, // TODO this should be removed
      ...drivingLicenses[0],
    }

    return {
      id: activeDrivingLicense.id,
      issued: activeDrivingLicense.utgafuDagsetning,
      expires: activeDrivingLicense.gildirTil,
      isProvisional: activeDrivingLicense.erBradabirgda,
      eligibilities: activeDrivingLicense.rettindi.map((eligibility) => ({
        id: eligibility.nr,
        issued: eligibility.utgafuDags,
        expires: eligibility.gildirTil,
        comment: eligibility.aths,
      })),
    }
  }
}
