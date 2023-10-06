import { Inject, Injectable } from '@nestjs/common'
import { DrugApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DrugBillInput } from './dto/drugBill.input'
import { DrugBillLineInput } from './dto/drugBillLine.input'
import { DrugInput } from './dto/drug.input'
import { DrugCalculatorInput } from './dto/drugCalculator.input'
import { PaginatedDrugResponse } from './models/drug.model'

const LOG_CATEGORY = 'rights-portal-drugs'
@Injectable()
export class DrugService {
  constructor(
    private api: DrugApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getPeriods(user: User) {
    try {
      return await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDrugPaymentPeriods()
    } catch (e) {
      this.logger.error('Error getting drug periods', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getBills(user: User, input: DrugBillInput) {
    try {
      return await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDrugBills(input)
    } catch (e) {
      this.logger.error('Error getting drug bills', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getBillLines(user: User, input: DrugBillLineInput) {
    try {
      return await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDrugBillLineItems(input)
    } catch (e) {
      this.logger.error('Error getting drug bill lines', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getDrugs(user: User, input: DrugInput) {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDrugs(input)

      const response = {
        data: data.drugs,
        pageInfo: data.pageInfo,
        totalCount: data.totalCount,
      } as PaginatedDrugResponse

      return response
    } catch (e) {
      this.logger.error('Error getting drugs', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getCalculations(user: User, input: DrugCalculatorInput) {
    try {
      const results = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .drugCalculator(input)

      return results
    } catch (e) {
      this.logger.error('Error getting drug calculations', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }

  async getCertificates(user: User) {
    try {
      return await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getDrugCertificates()
    } catch (e) {
      this.logger.error('Error getting drug certificates', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }
}
