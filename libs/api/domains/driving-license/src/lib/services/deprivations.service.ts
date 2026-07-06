import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { PenaltyPointsClientService } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'
import {
  DrivingLicenseDeprivation,
  DrivingLicenseDeprivationStatus,
} from '../models'

@Injectable()
export class DeprivationsService {
  constructor(
    private readonly penaltyPointsClientService: PenaltyPointsClientService,
  ) {}

  async getDeprivations(user: User): Promise<DrivingLicenseDeprivation[]> {
    const deprivations = await this.penaltyPointsClientService.deprivations(
      user,
    )

    return deprivations
      .map((d) => {
        if (!d.dateFrom) return undefined

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
          retakeLicense: d.retakeLicense ?? undefined,
        }
      })
      .filter(isDefined)
  }
}
