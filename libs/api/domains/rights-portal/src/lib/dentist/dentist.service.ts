import { Inject, Injectable } from '@nestjs/common'
import { DentistApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import subYears from 'date-fns/subYears'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Dentist, PaginatedDentistsResponse } from './models/dentist.model'
import { DentistStatus } from './models/status.model'
import { DentistBill } from './models/bill.model'
import { DentistsInput } from './dto/dentist.input'
import { DentistRegistration } from './models/registration.model'
import { DentistRegisterResponse } from './models/registerResponse.model'

const LOG_CATEGORY = 'rights-portal-dentist'

@Injectable()
export class DentistService {
  constructor(
    private api: DentistApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  async getCurrentDentist(user: User): Promise<Dentist | null> {
    try {
      const res = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCurrentDentist()

      if (!res || !res.id) return null

      return {
        id: res.id,
        name: res.name,
      }
    } catch (e) {
      this.logger.error('Failed to get current dentist', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getDentistStatus(user: User): Promise<DentistStatus | null> {
    try {
      const res = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .dentiststatus()
      if (!res) return null

      return {
        isInsured: res.isInsured,
        canRegister: res.canRegister,
        contractType: res.contractType,
      }
    } catch (e) {
      this.logger.error('Failed to get dentist status', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getDentistRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<DentistRegistration | null> {
    const api = this.api.withMiddleware(new AuthMiddleware(user as Auth))
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
        history: bills as Array<DentistBill>,
      }
    } catch (e) {
      this.logger.error('Failed to get dentist registrations', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getDentists(
    user: User,
    input: DentistsInput,
  ): Promise<PaginatedDentistsResponse | null> {
    try {
      const res = await this.api
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
      this.logger.error('Failed to get dentists', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async registerDentist(
    user: User,
    id: number,
  ): Promise<DentistRegisterResponse> {
    try {
      await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .registerDentist({
          id,
        })

      return {
        success: true,
      }
    } catch (e) {
      this.logger.error('Failed to register dentist', {
        ...e,
        category: LOG_CATEGORY,
      })

      if (e.response?.status === 400) {
        handle404(e)
      }

      return {
        success: false,
      }
    }
  }
}
