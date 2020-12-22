import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'
import { Union } from './union.model'
import { PensionFund } from './pensionFund.model'
import { ParentalLeaveEntitlement } from './parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from './parentalLeavePaymentPlan.model'

// const accessToken = process.env.DIRECTORATE_OF_LABOUR_ACCESS_TOKEN

// TODO implement this class when the endpoints are ready, this is just mocks atm

@Injectable()
export class DirectorateOfLabourRepository {
  //   private client: any

  constructor() {
    logger.debug('Created Directorate of labour repository')
  }

  //   getClient(): any {
  //     if (!accessToken) {
  //       throw new Error(
  //         'Missing environment variables: DIRECTORATE_OF_LABOUR_ACCESS_TOKEN',
  //       )
  //     }

  //     if (this.client) {
  //       return this.client
  //     }

  //     return 'new client'
  //   }

  async getUnions(): Promise<Union[]> {
    return [
      {
        id: 'id',
        name: 'VR',
      },
    ]
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    return [
      {
        id: 'id',
        name: 'Frjalsi',
      },
    ]
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: string,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement[]> {
    return [
      {
        independentMonths: 5,
        transferableMonths: 1,
      },
    ]
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string,
    period: ParentalLeavePeriod[],
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan[]> {
    const paymentPlan: ParentalLeavePaymentPlan[] = period.map((p) => {
      return {
        estimatedAmount: 405300,
        pensionAmount: 14800,
        privatePensionAmount: 0,
        unionAmount: 0,
        taxAmount: 77500,
        estimatePayment: 405300,
        period: p,
      }
    })
    return Promise.resolve(paymentPlan)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string,
    applicationId: string,
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan[]> {
    return [
      {
        estimatedAmount: 1.0,
        pensionAmount: 0.0,
        privatePensionAmount: 0.0,
        unionAmount: 0.0,
        taxAmount: 0.0,
        estimatePayment: 0.0,
        period: {
          from: '01-01-2020',
          to: '01-01-2020',
          ratio: 0.8,
          approved: true,
          paid: true,
        },
      },
    ]
  }
}
