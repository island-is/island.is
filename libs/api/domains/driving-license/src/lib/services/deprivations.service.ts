import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { PenaltyPointsClientService } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'
import {
  DrivingLicenseDeprivations,
  DrivingLicenseDeprivationStatus,
} from '../models'

@Injectable()
export class DeprivationsService {
  constructor(
    private readonly penaltyPointsClientService: PenaltyPointsClientService,
  ) {}

  async getDeprivations(user: User): Promise<DrivingLicenseDeprivations> {
    const deprivations = await this.penaltyPointsClientService.deprivations(
      user,
    )

    const mapped = deprivations
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

        const dateTo = d.dateTo ?? undefined
        const active = !dateTo || dateTo >= new Date()

        return {
          dateFrom: d.dateFrom,
          dateTo,
          status,
          name: d.deprivationName ?? undefined,
          type: d.deprivationType ?? undefined,
          retakeRequired: d.retakeLicense ?? undefined,
          active,
        }
      })
      .filter(isDefined)
      .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime())

    const [current, ...history] = mapped

    return { current, history }
  }
}
