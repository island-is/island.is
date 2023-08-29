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
} from './models/healthCenter.model'
import { DentistBill, UserDentist } from './models/userDentist.model'
import subYears from 'date-fns/subYears'
import {
  AidOrNutrition,
  PaginatedAidsAndNutritionResponse,
} from './models/aidsOrNutrition.model'
import {
  AidOrNutritionType,
  ExcludesFalse,
  generateAidOrNutrition,
} from './rightsPortal.types'

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

  async getAidsAndNutrition(
    user: User,
  ): Promise<PaginatedAidsAndNutritionResponse | null> {
    try {
      const res = await this.aidsAndNutritionApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .aidsandnutrition()

      if (!res) {
        return null
      }
      const nutrition: Array<AidOrNutrition> | null =
        res.nutrition
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.NUTRITION))
          .filter((Boolean as unknown) as ExcludesFalse) ?? []

      const aids: Array<AidOrNutrition> | null =
        res.aids
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.AID))
          .filter((Boolean as unknown) as ExcludesFalse) ?? []

      return {
        data: [...aids, ...nutrition],
        totalCount: aids?.length,
        pageInfo: {
          hasNextPage: false,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentists(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<UserDentist | null> {
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
