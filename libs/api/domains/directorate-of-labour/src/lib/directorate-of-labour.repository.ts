import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

const accessToken = process.env.DIRECTORATE_OF_LABOUR_ACCESS_TOKEN

// TODO implement this class when the endpoints are ready, this is just mocks atm

@Injectable()
export class DirectorateOfLabourRepository {
  private client: any

  constructor() {
    logger.debug('Created Directorate of labour repository')
  }

  getClient(): any {
    if (!accessToken) {
      throw new Error(
        'Missing environment variables: DIRECTORATE_OF_LABOUR_ACCESS_TOKEN',
      )
    }

    if (this.client) {
      return this.client
    }

    return 'client'
  }

  async getUnions() {
    return [
      {
        id: 'id',
        name: 'Name',
      },
    ]
  }

  async getPensionFunds() {
    return [
      {
        id: 'id',
        name: 'Name',
      },
    ]
  }

  async getParentalLeavesEntitlements(dateOfBirth: string, nationalId: string) {
    return [
      {
        independentMonths: 5,
        transferableMonths: 1,
      },
    ]
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string,
    period: ParentalLeavePeriod,
    nationalId: string,
  ) {
    return {
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
    }
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string,
    applicationId: string,
    nationalId: string,
  ) {
    return {
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
    }
  }
}
