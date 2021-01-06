import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { DrivingLicense } from './drivingLicense.type'
import { DrivingLicenseApi } from './client'

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  async getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicense> {
    const drivingLicense = await this.drivingLicenseApi.getDrivingLicense(
      nationalId,
    )

    return {
      id: drivingLicense.id,
      issued: drivingLicense.utgafuDagsetning,
      expires: drivingLicense.gildirTil,
      eligibilities: drivingLicense.rettindi.map((eligibility) => ({
        id: eligibility.nr,
        issued: eligibility.utgafuDags,
        expires: eligibility.gildirTil,
        comment: eligibility.aths,
      })),
    }
  }
}
