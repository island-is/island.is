import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { GenericLicense } from './licenceService.type'
import { LicenseServiceApi } from './client'

@Injectable()
export class LicenseServiceService {
  constructor(private readonly licenseService: LicenseServiceApi) {}

  async getAllLicenses(
    nationalId: User['nationalId'],
  ): Promise<GenericLicense[]> {
    console.log('GenericLicense query !!!!!!!!!!!!!!!!!!!!!!!')
    const drivingLicense = await this.licenseService.getGenericDrivingLicense(
      nationalId,
    )
    console.log({ drivingLicense })
    const drivingLicenseTest = { type: 'driving', issuer: 'rls', name: 'Foo' }

    return [drivingLicenseTest]
  }
}
