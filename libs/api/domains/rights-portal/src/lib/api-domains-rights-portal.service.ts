import { Injectable } from '@nestjs/common'
import {
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  TherapyApi,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import {
  HealthCenterHistory,
  HealthCenterHistoryEntry,
} from './models/getHealthCenter.model'
import { Dentists, DentistBill } from './models/getDentists.model'
import subYears from 'date-fns/subYears'

/** Category to attach each log message to */
const LOG_CATEGORY = 'rights-portal-service'

@Injectable()
export class RightsPortalService {
  constructor(
    private therapyApi: TherapyApi,
    private aidsAndNutritionApi: AidsandnutritionApi,
    private dentistApi: DentistApi,
    private healthCenterApi: HealthcenterApi,
  ) {}
  getTherapies = (user: User) =>
    this.therapyApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .therapies()
      .catch(handle404)

  getAidsAndNutrition = (user: User) =>
    this.aidsAndNutritionApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .aidsandnutrition()
      .catch(handle404)

  async getDentists(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<Dentists | null> {
    const api = this.dentistApi.withMiddleware(new AuthMiddleware(user as Auth))
    try {
      const res = await Promise.all([
        api.dentistsCurrent(),
        api.dentistsBills({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        }),
      ])

      if (!res) return null
      return {
        currentDentistName: res[0].name,
        billHistory: res[1] as DentistBill[],
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getHealthCenterHistory(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<HealthCenterHistory | null> {
    const api = this.healthCenterApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

    try {
      const res = await Promise.all([
        api.healthcentersCurrent(),
        api.healthcentersHistory({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        }),
      ])

      const history = res[1]
        ? res[1].map(
            (h) =>
              ({
                ...h,
                healthCenter: {
                  ...h.healthCenter,
                  name: h.healthCenter?.healthCenter,
                },
              } as HealthCenterHistoryEntry),
          )
        : []

      if (!res) return null
      return {
        current: {
          ...res[0],
          name: res[0].healthCenter,
        },
        history,
      }
    } catch (e) {
      return handle404(e)
    }
  }
}
