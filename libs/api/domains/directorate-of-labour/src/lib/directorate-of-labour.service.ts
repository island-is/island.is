import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Union, PensionFund } from '@island.is/clients/vmst'

import { ParentalLeavePeriod } from '../models/parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from '../models/parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from '../models/parentalLeavePaymentPlan.model'
import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeave } from '../models/parentalLeaves.model'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'

const handleError = (error: any) => {
  logger.error(error)

  throw new ApolloError(
    'Failed to resolve request',
    error?.message ?? error?.response?.message,
  )
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
    dateOfBirth: Date,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEntitlements(dateOfBirth, nationalId)
      .catch(handleError)
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeaves(nationalId)
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

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    return await this.directorateOfLabourRepository
      .getPregnancyStatus(nationalId)
      .catch(handleError)
  }
}
