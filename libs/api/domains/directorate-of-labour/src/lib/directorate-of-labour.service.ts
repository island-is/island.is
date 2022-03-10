import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Union, PensionFund } from '@island.is/clients/vmst'

import { ParentalLeavePeriod } from '../models/parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from '../models/parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from '../models/parentalLeavePaymentPlan.model'
import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeave } from '../models/parentalLeave.model'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'

@Injectable()
export class DirectorateOfLabourService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private directorateOfLabourRepository: DirectorateOfLabourRepository,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getUnions(): Promise<Union[]> {
    return await this.directorateOfLabourRepository
      .getUnions()
      .catch(this.handleError.bind(this))
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPensionFunds()
      .catch(this.handleError.bind(this))
  }

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    return await this.directorateOfLabourRepository
      .getPrivatePensionFunds()
      .catch(this.handleError.bind(this))
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: Date,
    nationalId: string,
  ): Promise<ParentalLeaveEntitlement | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEntitlements(dateOfBirth, nationalId)
      .catch(this.handleError.bind(this))
  }

  async getParentalLeaves(nationalId: string): Promise<ParentalLeave[] | null> {
    return await this.directorateOfLabourRepository
      .getParentalLeaves(nationalId)
      .catch(this.handleError.bind(this))
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
      .catch(this.handleError.bind(this))
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string,
    period: ParentalLeavePeriod[],
    nationalId: string,
  ): Promise<ParentalLeavePaymentPlan[]> {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEstimatedPaymentPlan(dateOfBirth, period, nationalId)
      .catch(this.handleError.bind(this))
  }

  async getParentalLeavesPeriodEndDate(
    nationalId: string,
    startDate: string,
    length: string,
    percentage: string,
  ) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesPeriodEndDate(
        nationalId,
        new Date(startDate),
        length,
        percentage,
      )
      .catch(this.handleError.bind(this))
  }

  async getParentalLeavesPeriodLength(
    nationalId: string,
    startDate: string,
    endDate: string,
    percentage: string,
  ) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesPeriodLength(
        nationalId,
        new Date(startDate),
        new Date(endDate),
        percentage,
      )
      .catch(this.handleError.bind(this))
  }

  async getPregnancyStatus(
    nationalId: string,
  ): Promise<PregnancyStatus | null> {
    return await this.directorateOfLabourRepository
      .getPregnancyStatus(nationalId)
      .catch(this.handleError.bind(this))
  }
}
