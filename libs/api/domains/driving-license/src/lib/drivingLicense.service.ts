import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { DrivingLicense, DrivingLicenseType } from './drivingLicense.type'
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
        id: eligibility.nr.trim(),
        issued: eligibility.utgafuDags,
        expires: eligibility.gildirTil,
        comment: eligibility.aths,
      })),
    }
  }

  async getDeprivationTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getDeprivationTypes()
    return types.map((type) => ({
      id: type.id.toString(),
      name: type.heiti,
    }))
  }

  async getEntitlementTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getEntitlementTypes()
    return types.map((type) => ({
      id: type.nr.trim(),
      name: type.heiti || '',
    }))
  }

  async getRemarkTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getRemarkTypes()
    return types.map((type) => ({
      id: type.nr,
      name: type.heiti,
    }))
  }
}
