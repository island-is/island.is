import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  DrivingLicenseApi,
  DtoV5DeprivationDto,
  DtoV6DeprivationDto,
  PenaltyPointsClientService,
} from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'

import {
  DrivingLicenseDeprivation,
  DrivingLicenseDeprivations,
  DrivingLicenseDeprivationStatus,
} from '../models'

const mapDeprivation = (
  d: DtoV5DeprivationDto | DtoV6DeprivationDto,
): DrivingLicenseDeprivation | null => {
  if (!d.dateFrom) return null

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
  const now = new Date()

  return {
    dateFrom: d.dateFrom,
    dateTo,
    status,
    name: d.deprivationName ?? undefined,
    type: d.deprivationType ?? undefined,
    retakeRequired: d.retakeLicense ?? undefined,
    active: d.dateFrom <= now && (!dateTo || dateTo >= now),
  }
}

@Injectable()
export class DeprivationsService {
  constructor(
    private readonly drivingLicenseApi: DrivingLicenseApi,
    private readonly penaltyPointsClientService: PenaltyPointsClientService,
  ) {}

  async getDeprivation(user: User): Promise<DrivingLicenseDeprivation | null> {
    const d = await this.drivingLicenseApi.getDeprivation({
      nationalId: user.nationalId,
      auth: user,
    })

    return d ? mapDeprivation(d) : null
  }

  async getDeprivations(user: User): Promise<DrivingLicenseDeprivations> {
    const deprivations = await this.penaltyPointsClientService.deprivations(
      user,
    )

    const [current, ...history] = deprivations
      .map(mapDeprivation)
      .filter(isDefined)
      .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime())

    return { current, history }
  }
}
