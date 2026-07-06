import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { PenaltyPointsClientService } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'
import { DrivingLicensePenaltyPointDetail } from '../models'

@Injectable()
export class PenaltyPointsService {
  constructor(
    private readonly penaltyPointsClientService: PenaltyPointsClientService,
  ) {}

  async getPenaltyPointDetails(
    user: User,
  ): Promise<{ details: DrivingLicensePenaltyPointDetail[] }> {
    const details = await this.penaltyPointsClientService.penaltyPointDetails(
      user,
    )

    return {
      details: details
        .map((d) => {
          if (!d.caseNr) return undefined
          return {
            id: d.caseNr,
            caseNumber: d.caseNr,
            offenseDate: d.offenseDate ?? undefined,
            penalty: d.penalty ?? undefined,
            penaltyStatus: d.penaltyStatus ?? undefined,
            points: d.points ?? undefined,
            districtName: d.districtName ?? undefined,
            statusCode: d.statusCode ?? undefined,
          }
        })
        .filter(isDefined),
    }
  }

  async getIsDeprived(user: User): Promise<boolean> {
    const isBelowThreshold =
      await this.penaltyPointsClientService.penaltyPointsDrivingLicenseApplicationIsBelowThreshold(
        user,
      )
    return !isBelowThreshold
  }
}
