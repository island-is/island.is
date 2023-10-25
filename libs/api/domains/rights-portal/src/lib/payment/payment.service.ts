import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { PaymentApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { CopaymentStatus } from './models/copaymentStatus.model'
import { CopaymentPeriod } from './models/copaymentPeriod.model'
import { CopaymentBill } from './models/copaymentBill.model'
import { PaymentError, PaymentErrorStatus } from './models/paymentError.model'
import { PaymentOverviewStatus } from './models/paymentOverviewStatus.model'
import { PaymentOverviewDocumentInput } from './dto/paymentOverviewDocument.input'
import { PaymentOverviewDocument } from './models/paymentOverviewDocument.model'
import { CopaymentBillsInput } from './dto/copaymentBills.input'
import { handle404 } from '@island.is/clients/middlewares'
import { PeriodInput } from './dto/copaymentPeriod.input'

export type PaymentResponse<T> = {
  items: T[]
  errors: PaymentError[]
}

@Injectable()
export class PaymentService {
  constructor(private readonly api: PaymentApi) {}

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
    input: PeriodInput,
  ): Promise<PaymentResponse<CopaymentPeriod>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getCopaymentPeriods(input)
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

  async getPaymentOverview(
    user: User,
    input: PeriodInput,
  ): Promise<PaymentResponse<PaymentOverviewStatus>> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getPaymentOverview(input)
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
