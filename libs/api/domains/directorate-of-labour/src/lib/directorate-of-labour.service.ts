import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { ApolloError } from 'apollo-server-express'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'
import { Union } from './union.model'
import { PensionFund } from './pensionFund.model'
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
  ) {}

  async getUnions(): Promise<Union[]> {
    return await this.directorateOfLabourRepository
      .getUnions()
      .catch(handleError)
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPensionFunds()
      .catch(handleError)
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
  ): Promise<ParentalLeavePaymentPlan> {
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
    period: ParentalLeavePeriod,
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEstimatedPaymentPlan(dateOfBirth, period, nationalId)
      .catch(handleError)
  }
}
