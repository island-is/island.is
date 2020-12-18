import { Injectable } from '@nestjs/common'

import { DrivingLicenseApi } from './client'
import { DrivingLicense } from './driving-license.model'

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  async getDrivingLicenses(nationalId: string): Promise<DrivingLicense[]> {
    const drivingLicenses = await this.drivingLicenseApi.getDrivingLicenses(
      nationalId,
    )
    return drivingLicenses.map((drivingLicense) => ({
      id: drivingLicense.id,
      name: drivingLicense.name,
      nationalId: drivingLicense.nationalId,
    }))
  }
}
