import { Inject, Injectable } from '@nestjs/common'
import { HealthcenterApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import subYears from 'date-fns/subYears'
import {
  HealthCenter,
  PaginatedHealthCentersResponse,
} from './models/healthCenter.model'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { HealthCenterRegisterResponse } from './models/healthCenterTransfer.model'
import { HealthCenterRegistrationHistory } from './models/healthCenterRecordHistory.model'
import { HealthCenterRecord } from './models/healthCenterRecord.model'
import { HealthCenterRegisterInput } from './dto/healthCenterTransfer.input'
import { HealthCenterDoctorsInput } from './dto/healthCenterDoctors.input'

const LOG_CATEGORY = 'rights-portal-health-center'

@Injectable()
export class HealthCenterService {
  constructor(
    private api: HealthcenterApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getHealthCenters(
    user: User,
  ): Promise<PaginatedHealthCentersResponse | null> {
    const res = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getHealthCenters({})
      .catch(handle404)

    if (!res || !res.healthCenters || !res.totalCount || !res.pageInfo) {
      return null
    }

    const healthCenters: Array<HealthCenter> = res.healthCenters
      .map((hc) => {
        if (!hc.id) {
          return null
        }
        return {
          ...hc,
          id: hc.id,
          address: {
            postalCode: hc.postalCode,
            municipality: hc.city,
            streetAddress: hc.address,
          },
        }
      })
      .filter(isDefined)

    return {
      data: healthCenters,
      totalCount: res.totalCount,
      pageInfo: {
        hasNextPage: res.pageInfo.hasNextPage ?? false,
        hasPreviousPage: res.pageInfo.hasPreviousPage ?? undefined,
        startCursor: res.pageInfo.startCursor ?? undefined,
        endCursor: res.pageInfo.endCursor ?? undefined,
      },
    }
  }

  async getHealthCentersRegistrationHistory(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<HealthCenterRegistrationHistory | null> {
    const api = this.api.withMiddleware(new AuthMiddleware(user as Auth))
    const res = await Promise.all([
      api.getCurrentHealthCenter().catch(handle404),
      api
        .getHealthCenterHistory({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        })
        .catch(handle404),
    ])

    const [healthCenterRes, historyRes] = res

    if (!healthCenterRes || !historyRes) return null

    const history = historyRes
      ? historyRes.map(
          (h) =>
            ({
              ...h,
              healthCenterName: h.healthCenter?.healthCenter,
              doctor: h.healthCenter?.doctor,
            } as HealthCenterRecord),
        )
      : []

    return {
      canRegister: healthCenterRes.canRegister ?? false,
      current: {
        ...res[0],
        healthCenterName: healthCenterRes.healthCenter ?? undefined,
      },
      history,
    }
  }

  async getHealthCenterDoctors(user: User, input: HealthCenterDoctorsInput) {
    return this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getHealthCenterDoctors(input)
      .catch(handle404)
  }

  async registerHealthCenter(
    user: User,
    input: HealthCenterRegisterInput,
  ): Promise<HealthCenterRegisterResponse> {
    return await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .registerHealthCenter(input)
      .then(() => ({ success: true }))
      .catch(() => ({ success: false }))
  }
}
