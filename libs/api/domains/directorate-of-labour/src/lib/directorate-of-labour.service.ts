import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { ApolloError } from 'apollo-server-express'
import {
  UnionApi,
  Union,
  PensionApi,
  PensionFund,
} from '@island.is/vmst-client'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from './parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from './parentalLeavePaymentPlan.model'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error.response.message)
}

@Injectable()
export class DirectorateOfLabourService {
  constructor(
    private directorateOfLabourRepository: DirectorateOfLabourRepository,
    private unionApi: UnionApi,
    private pensionApi: PensionApi,
  ) {}

  async getUnions(): Promise<Union[]> {
    const { unions } = await this.unionApi.unionGetUnions()

    if (unions) {
      return unions
    }

    throw new Error('Could not fetch unions')
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    const { pensionFunds } = await this.pensionApi.pensionGetPensionFunds()

    if (pensionFunds) {
      return pensionFunds
    }

    throw new Error('Could not fetch unions')
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: string,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEntitlements(dateOfBirth, nationalId)
      .catch(handleError)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string,
    applicationId: string,
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesApplicationPaymentPlan(
        dateOfBirth,
        applicationId,
        nationalId,
      )
      .catch(handleError)
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string,
    period: ParentalLeavePeriod[],
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEstimatedPaymentPlan(dateOfBirth, period, nationalId)
      .catch(handleError)
  }
}
