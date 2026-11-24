import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'

import {
  DrivingLicenseDeprivation,
  DrivingLicenseDeprivationStatus,
} from '../models'

@Injectable()
export class DeprivationService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  async getDeprivation(user: User): Promise<DrivingLicenseDeprivation | null> {
    const d = await this.drivingLicenseApi.getDeprivation({
      nationalId: user.nationalId,
      auth: user,
    })

    if (!d?.dateFrom) return null

    const lost = d.licenseLost ?? false
    const expired = d.licenseExpired ?? false
    const status =
      lost && expired
        ? DrivingLicenseDeprivationStatus.LOSTANDEXPIRED
        : lost
        ? DrivingLicenseDeprivationStatus.LOST
        : expired
        ? DrivingLicenseDeprivationStatus.EXPIRED
        : undefined

    return {
      dateFrom: d.dateFrom,
      dateTo: d.dateTo ?? undefined,
      status,
      name: d.deprivationName ?? undefined,
      type: d.deprivationType ?? undefined,
      retakeRequired: d.retakeLicense ?? undefined,
    }
  }
}
