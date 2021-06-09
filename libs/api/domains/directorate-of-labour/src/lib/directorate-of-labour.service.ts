import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Union, PensionFund } from '@island.is/clients/vmst'

import { ParentalLeavesPeriod } from '../models/parentalLeavesPeriod.model'
import { ParentalLeavesEntitlement } from '../models/parentalLeavesEntitlement.model'
import { ParentalLeavesPaymentPlan } from '../models/parentalLeavesPaymentPlan.model'
import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeave } from '../models/parentalLeaves.model'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'

@Injectable()
export class DirectorateOfLabourService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private directorateOfLabourRepository: DirectorateOfLabourRepository,
  ) {}

  handleError(error: any): any {
    // this.logger.error(error)
    console.log('-error', error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getUnions(): Promise<Union[]> {
    return await this.directorateOfLabourRepository
      .getUnions()
      .catch(this.handleError)
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPensionFunds()
      .catch(this.handleError)
  }

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPrivatePensionFunds()
      .catch(this.handleError)
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: Date,
    nationalId: string,
  ): Promise<ParentalLeavesEntitlement | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEntitlements(dateOfBirth, nationalId)
      .catch(this.handleError)
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeaves(nationalId)
      .catch(this.handleError)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string,
    applicationId: string,
    nationalId: string,
  ): Promise<ParentalLeavesPaymentPlan[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesApplicationPaymentPlan(
        dateOfBirth,
        applicationId,
        nationalId,
      )
      .catch(this.handleError)
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string,
    period: ParentalLeavesPeriod[],
    nationalId: string,
  ): Promise<ParentalLeavesPaymentPlan[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEstimatedPaymentPlan(dateOfBirth, period, nationalId)
      .catch(this.handleError)
  }

  async getParentalLeavesPeriodsEndDate(
    nationalId: string,
    startDate: string,
    length: string,
    percentage: string,
  ) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesPeriodsEndDate(
        nationalId,
        new Date(startDate),
        length,
        percentage,
      )
      .catch(this.handleError)
  }

  async getParentalLeavesPeriodsLength(
    nationalId: string,
    startDate: string,
    endDate: string,
    percentage: string,
  ) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesPeriodsLength(
        nationalId,
        new Date(startDate),
        new Date(endDate),
        percentage,
      )
      .catch(this.handleError)
  }

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    return await this.directorateOfLabourRepository
      .getPregnancyStatus(nationalId)
      .catch(this.handleError)
  }
}
