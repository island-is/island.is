import { Inject, Injectable } from '@nestjs/common'
import {
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  TherapyApi,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import subYears from 'date-fns/subYears'
import {
  AidOrNutrition,
  PaginatedAidsAndNutritionResponse,
} from './models/aidsOrNutrition.model'
import {
  AidOrNutritionType,
  generateAidOrNutrition,
} from './rightsPortal.types'
import {
  Dentist,
  DentistStatus,
  PaginatedDentistsResponse,
  UserDentistRegistration,
} from './models/dentist.model'
import { Bill } from './models/bill.model'
import {
  HealthCenter,
  HealthCenterRegistration,
  PaginatedHealthCentersResponse,
  UserHealthCenterRegistration,
} from './models/healthCenter.model'
import { HealthCenterResponse } from './models/healthCenterResponse.model'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { GetDentistsInput } from './dto/getDentists.input'
import { RegisterDentistResponse } from './models/registerDentistResponse'

@Injectable()
export class RightsPortalService {
  constructor(
    private therapyApi: TherapyApi,
    private aidsAndNutritionApi: AidsandnutritionApi,
    private dentistApi: DentistApi,
    private healthCenterApi: HealthcenterApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  getTherapies = (user: User) =>
    this.therapyApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getTherapies()
      .catch(handle404)

  async getAidsAndNutrition(
    user: User,
  ): Promise<PaginatedAidsAndNutritionResponse | null> {
    try {
      const res = await this.aidsAndNutritionApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAidsAndNutrition()

      if (!res) {
        return null
      }
      const nutrition =
        res.nutrition
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.NUTRITION))
          .filter(isDefined) ?? []

      const aids =
        res.aids
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.AID))
          .filter(isDefined) ?? []

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

  async getCurrentDentist(user: User): Promise<Dentist | null> {
    try {
      const res = await this.dentistApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCurrentDentist()

      if (!res || !res.id) return null

      return {
        id: res.id,
        name: res.name,
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentistStatus(user: User): Promise<DentistStatus | null> {
    try {
      const res = await this.dentistApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .dentiststatus()
      if (!res) return null

      return {
        isInsured: res.isInsured,
        canRegister: res.canRegister,
        contractType: res.contractType,
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentistRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<UserDentistRegistration | null> {
    const api = this.dentistApi.withMiddleware(new AuthMiddleware(user as Auth))
    try {
      const res = await Promise.all([
        api.getCurrentDentist(),
        api.dentiststatus(),
        api.getDentistBills({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        }),
      ])

      if (!res) return null

      const [current, status, bills] = res

      return {
        dentist: {
          name: current.name,
          id: current.id,
          status: {
            isInsured: status.isInsured,
            canRegister: status.canRegister,
            contractType: status.contractType,
          },
        },
        history: bills as Array<Bill>,
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async getDentists(
    user: User,
    input: GetDentistsInput,
  ): Promise<PaginatedDentistsResponse | null> {
    try {
      const res = await this.dentistApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDentists({
          ...input,
        })

      if (!res || !res.dentists || !res.totalCount || !res.pageInfo) {
        return null
      }

      const dentists: Array<Dentist> = res.dentists
        .map((d) => {
          if (!d.id) {
            return null
          }
          return {
            ...d,
            id: d.id,
            practices: d.practices?.map((p) => ({
              practice: p.practice,
              region: p.region,
              postalCode: p.postalCode,
              address: p.address,
            })),
          }
        })
        .filter(isDefined)

      return {
        data: dentists,
        totalCount: res.totalCount,
        pageInfo: {
          hasNextPage: res.pageInfo.hasNextPage ?? false,
          hasPreviousPage: res.pageInfo.hasPreviousPage ?? undefined,
          startCursor: res.pageInfo.startCursor ?? undefined,
          endCursor: res.pageInfo.endCursor ?? undefined,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async registerDentist(
    user: User,
    id: number,
  ): Promise<RegisterDentistResponse> {
    try {
      await this.dentistApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .registerDentist({
          id,
        })

      return {
        success: true,
      }
    } catch (e) {
      if (e.response?.status === 400) handle404(e)
      this.logger.error('Failed to register dentist', e)

      return {
        success: false,
      }
    }
  }
  async getHealthCenters(
    user: User,
  ): Promise<PaginatedHealthCentersResponse | null> {
    try {
      const res = await this.healthCenterApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getHealthCenters({})

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
    } catch (e) {
      return handle404(e)
    }
  }

  async getUserHealthCenterRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<UserHealthCenterRegistration | null> {
    const api = this.healthCenterApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

    try {
      const res = await Promise.all([
        api.getCurrentHealthCenter(),
        api.getHealthCenterHistory({
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
                healthCenterName: h.healthCenter?.healthCenter,
                doctor: h.healthCenter?.doctor,
              } as HealthCenterRegistration),
          )
        : []

      if (!res) return null
      return {
        current: {
          ...res[0],
          healthCenterName: res[0].healthCenter ?? undefined,
        },
        history,
        canRegister: res[0].canRegister,
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async transferHealthCenter(
    user: User,
    id: string,
  ): Promise<HealthCenterResponse> {
    try {
      await this.healthCenterApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .registerHealthCenter({
          id,
        })
      return {
        success: true,
      }
    } catch (e) {
      if (e.response?.status === 400) handle404(e)

      this.logger.error('Failed to transfer health center', e)

      return {
        success: false,
      }
    }
  }
}
