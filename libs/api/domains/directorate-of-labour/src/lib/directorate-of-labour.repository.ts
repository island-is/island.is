import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import {
  UnionApi,
  Union,
  PensionApi,
  PensionFund,
  ParentalLeaveApi,
  PregnancyApi,
} from '@island.is/clients/vmst'

import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeavePeriod } from '../models/parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from '../models/parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from '../models/parentalLeavePaymentPlan.model'

const isRunningInDevelopment = process.env.NODE_ENV === 'development'

enum PensionFundType {
  required = 'L',
  private = 'X',
}

@Injectable()
export class DirectorateOfLabourRepository {
  constructor(
    private parentalLeaveApi: ParentalLeaveApi,
    private unionApi: UnionApi,
    private pensionApi: PensionApi,
    private pregnancyApi: PregnancyApi,
  ) {
    logger.debug('Created Directorate of labour repository')
  }

  private async getAllPensionFunds(): Promise<PensionFund[]> {
    const { pensionFunds } = await this.pensionApi.pensionGetPensionFunds()

    if (pensionFunds) {
      return pensionFunds
    }

    throw new Error('Could not fetch pension funds')
  }

  async getUnions(): Promise<Union[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'VR',
        },
      ]
    }

    const { unions } = await this.unionApi.unionGetUnions()

    if (unions) {
      return unions
    }

    throw new Error('Could not fetch unions')
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'Frjalsi',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.required),
    )
  }

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'Frjalsi',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.private),
    )
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: string,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement> {
    if (isRunningInDevelopment) {
      return {
        independentMonths: 6,
        transferableMonths: 1.5,
      }
    }

    return await this.parentalLeaveApi.parentalLeaveGetRights({
      nationalRegistryId: nationalId,
      dateOfBirth: new Date(dateOfBirth),
    })
  }

  async getParentalLeaves(nationalId: string) {
    if (isRunningInDevelopment) {
      return [
        {
          applicationId: '1234uuid1234',
          applicant: nationalId,
          otherParentId: '1234567789',
          expectedDateOfBirth: '2021-01-12',
          dateOfBirth: '2021-01-15',
          email: 'mock@mock.is',
          phoneNumber: '555-1234',
          paymentInfo: {
            bankAccount: '44426123456',
            personalAllowance: 100,
            personalAllowanceFromSpouse: 0,
            union: { id: 'vr', name: 'VR' },
            pensionFund: { id: 'freedom', name: 'Frjálsi' },
            privatePensionFund: { id: 'private', name: 'Private' },
            privatePensionFundRatio: 0,
          },
          periods: [],
          employers: [
            { nationalRegistryId: '6543212245', email: 'asdf@boss.is' },
          ],
          status: 'status',
          rightsCode: 'code',
        },
      ]
    }

    const results = await this.parentalLeaveApi.parentalLeaveGetParentalLeaves({
      nationalRegistryId: nationalId,
    })

    return results.parentalLeaves ?? []
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    period: ParentalLeavePeriod[],
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
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
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    applicationId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
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

  async getPregnancyStatus(nationalId: string): Promise<PregnancyStatus> {
    if (isRunningInDevelopment) {
      return {
        hasActivePregnancy: true,
        pregnancyDueDate: '2021-01-15',
      }
    }

    return ((await this.pregnancyApi.pregnancyGetPregnancyStatus({
      nationalRegistryId: nationalId,
    })) as unknown) as PregnancyStatus
  }
}
