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
    const res = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getCurrentDentist()
      .catch(handle404)

    if (!res || !res.id) return null

    return {
      id: res.id,
      name: res.name,
    }
  }

  async getDentistStatus(user: User): Promise<DentistStatus | null> {
    const res = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .dentiststatus()
      .catch(handle404)

    if (!res) return null

    return {
      isInsured: res.isInsured,
      canRegister: res.canRegister,
      contractType: res.contractType,
    }
  }

  async getDentistRegistrations(
    user: User,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<DentistRegistration | null> {
    const api = this.api.withMiddleware(new AuthMiddleware(user as Auth))
    const res = await Promise.all([
      api.getCurrentDentist().catch(handle404),
      api.dentiststatus().catch(handle404),
      api
        .getDentistBills({
          dateFrom: dateFrom
            ? dateFrom.toDateString()
            : subYears(new Date(), 5).toDateString(),
          dateTo: dateTo ? dateTo.toDateString() : new Date().toDateString(),
        })
        .catch(handle404),
    ])

    if (!res) return null

    const [current, status, bills] = res

    if (!current || !status || !bills) return null

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
  }

  async getDentists(
    user: User,
    input: DentistsInput,
  ): Promise<PaginatedDentistsResponse | null> {
    const res = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getDentists({
        ...input,
      })
      .catch(handle404)

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
  }

  async registerDentist(
    user: User,
    id: number,
  ): Promise<DentistRegisterResponse> {
    return await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .registerDentist({
        id,
      })
      .then(() => ({ success: true }))
      .catch(() => ({ success: false }))
  }
}
