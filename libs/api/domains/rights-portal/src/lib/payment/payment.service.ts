import { Inject, Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  PaymentApi,
  PaymentOverviewDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { CopaymentStatus } from './models/copaymentStatus.model'
import { CopaymentPeriod } from './models/copaymentPeriod.model'
import { CopaymentBill } from './models/copaymentBill.model'
import { PaymentError, PaymentErrorStatus } from './models/paymentError.model'
import { PaymentOverviewStatus } from './models/paymentOverviewStatus.model'
import { PaymentOverviewDocumentInput } from './dto/paymentOverviewDocument.input'
import { PaymentOverviewDocument } from './models/paymentOverviewDocument.model'
import { CopaymentBillsInput } from './dto/copaymentBills.input'
import { PaymentOverviewBill } from './models/paymentOverviewBill.model'
import { handle404 } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'rights-portal-payment'

export type PaymentResponse<T> = {
  items: T[]
  errors: PaymentError[]
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly api: PaymentApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getCopaymentStatus(
    user: User,
  ): Promise<PaymentResponse<CopaymentStatus>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCopaymentStatus()
        .catch(handle404)

      return {
        items: data ? [data] : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  async getCopaymentPeriods(
    user: User,
  ): Promise<PaymentResponse<CopaymentPeriod>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCopaymentPeriods({
          dateFrom: new Date().toISOString(),
          dateTo: new Date().toISOString(),
        })
        .catch(handle404)

      return {
        items: data ? data : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  async getCopaymentBills(
    user: User,
    input: CopaymentBillsInput,
  ): Promise<PaymentResponse<CopaymentBill>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCopaymentBills(input)
        .catch(handle404)

      return {
        items: data ? data : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  private async fetchPaymentOverview(
    user: User,
  ): Promise<PaymentResponse<PaymentOverviewDTO>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getPaymentOverview({
          dateFrom: new Date().toISOString(),
          dateTo: new Date().toISOString(),
        })
        .catch(handle404)

      return {
        items: data ? [data] : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  async getPaymentOverviewStatus(
    user: User,
  ): Promise<PaymentResponse<PaymentOverviewStatus>> {
    try {
      const data = await this.fetchPaymentOverview(user)

      const payment = data?.items?.[0]

      return {
        items: payment ? [payment] : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  async getPaymentOverviewBills(
    user: User,
  ): Promise<PaymentResponse<PaymentOverviewBill>> {
    try {
      const data = await this.fetchPaymentOverview(user)

      const payment = data?.items?.[0]

      return {
        items: payment.bills ? [...payment.bills] : [],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }

  async getPaymentOverviewBillDocument(
    user: User,
    input: PaymentOverviewDocumentInput,
  ): Promise<PaymentResponse<PaymentOverviewDocument>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getPaymentOverviewDocument(input)
        .catch(handle404)

      if (!data)
        return {
          items: [],
          errors: [{ status: PaymentErrorStatus.NOT_FOUND }],
        }

      return {
        items: [data],
        errors: [],
      }
    } catch (error) {
      return {
        items: [],
        errors: [{ status: PaymentErrorStatus.INTERNAL_SERVICE_ERROR }],
      }
    }
  }
}
