import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { License } from './licenceService.type'
import { DrivingLicenseApi } from './client'

@Injectable()
export class LicenseServiceService {
  constructor(private readonly drivingLicense: DrivingLicenseApi) {}

  async getAllLicenses(nationalId: User['nationalId']): Promise<License[]> {
    const drivingLicenses = await this.drivingLicense.getDrivingLicenses(
      nationalId,
    )
    return [{'type': 'driving', 'licences': drivingLicenses}]
  }
}
