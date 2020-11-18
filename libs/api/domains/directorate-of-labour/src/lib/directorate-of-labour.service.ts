import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { ApolloError } from 'apollo-server-express'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

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

  async getUnions() {
    return await this.directorateOfLabourRepository
      .getUnions()
      .catch(handleError)
  }

  async getPensionFunds() {
    return await this.directorateOfLabourRepository
      .getPensionFunds()
      .catch(handleError)
  }

  async getParentalLeavesEntitlements(dateOfBirth: string, nationalId: string) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEntitlements(dateOfBirth, nationalId)
      .catch(handleError)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string,
    applicationId: string,
    nationalId: string,
  ) {
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
  ) {
    return await this.directorateOfLabourRepository
      .getParentalLeavesEstimatedPaymentPlan(dateOfBirth, period, nationalId)
      .catch(handleError)
  }
}
