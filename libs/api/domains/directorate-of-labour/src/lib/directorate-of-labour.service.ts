import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { ApolloError } from 'apollo-server-express'
import { Union, PensionFund } from '@island.is/clients/vmst'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from './parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from './parentalLeavePaymentPlan.model'
import { ParentalLeavePregnancyStatus } from './parentalLeavePregnancyStatus.model'

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

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPrivatePensionFunds()
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

  async getParentalLeavePregnancyStatus(
    nationalId: string,
  ): Promise<ParentalLeavePregnancyStatus | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeavePregnancyStatus(nationalId)
      .catch(handleError)
  }
}
