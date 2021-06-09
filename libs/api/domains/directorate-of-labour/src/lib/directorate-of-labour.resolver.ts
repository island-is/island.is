import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'

import { Union } from '../models/union.model'
import { PensionFund } from '../models/pensionFund.model'
import { ParentalLeavesEntitlement } from '../models/parentalLeavesEntitlement.model'
import { ParentalLeavesPaymentPlan } from '../models/parentalLeavesPaymentPlan.model'
import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeave } from '../models/parentalLeaves.model'
import { GetParentalLeavesEntitlementsInput } from '../dto/getParentalLeavesEntitlements.input'
import { GetParentalLeavesEstimatedPaymentPlanInput } from '../dto/getParentalLeavesEstimatedPaymentPlan.input'
import { GetParentalLeavesApplicationPaymentPlanInput } from '../dto/getParentalLeavesApplicationPaymentPlan.input'
import { GetParentalLeavesPeriodsEndDateInput } from '../dto/getParentalLeavesPeriodsEndDate.input'
import { GetParentalLeavesPeriodsLengthInput } from '../dto/getParentalLeavesPeriodsLength.input'
import { ParentalLeavesPeriodsEndDate } from '../models/parentalLeavesPeriodsEndDate.model'
import { ParentalLeavesPeriodsLength } from '../models/parentalLeavesPeriodsLength.model'
import { DirectorateOfLabourService } from './directorate-of-labour.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class DirectorateOfLabourResolver {
  constructor(private directorateOfLabourService: DirectorateOfLabourService) {}

  @Query(() => ParentalLeavesEntitlement, { nullable: true })
  async getParentalLeavesEntitlements(
    @Args('input') input: GetParentalLeavesEntitlementsInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeavesEntitlement | null> {
    return this.directorateOfLabourService.getParentalLeavesEntitlements(
      new Date(input.dateOfBirth),
      user.nationalId,
    )
  }

  @Query(() => [ParentalLeave], { nullable: true })
  async getParentalLeaves(
    @CurrentUser() user: User,
  ): Promise<ParentalLeave[] | null> {
    return this.directorateOfLabourService.getParentalLeaves(user.nationalId)
  }

  @Query(() => [ParentalLeavesPaymentPlan], { nullable: true })
  async getParentalLeavesEstimatedPaymentPlan(
    @Args('input') input: GetParentalLeavesEstimatedPaymentPlanInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeavesPaymentPlan[] | null> {
    return this.directorateOfLabourService.getParentalLeavesEstimatedPaymentPlan(
      input.dateOfBirth,
      input.period,
      user.nationalId,
    )
  }

  @Query(() => [ParentalLeavesPaymentPlan], { nullable: true })
  async getParentalLeavesApplicationPaymentPlan(
    @Args('input') input: GetParentalLeavesApplicationPaymentPlanInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeavesPaymentPlan[] | null> {
    return this.directorateOfLabourService.getParentalLeavesApplicationPaymentPlan(
      input.dateOfBirth,
      input.applicationId,
      user.nationalId,
    )
  }

  @Query(() => ParentalLeavesPeriodsEndDate)
  async getParentalLeavesPeriodsEndDate(
    @Args('input') input: GetParentalLeavesPeriodsEndDateInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfLabourService.getParentalLeavesPeriodsEndDate(
      user.nationalId,
      input.startDate,
      input.length,
      input.percentage,
    )
  }

  @Query(() => ParentalLeavesPeriodsLength)
  async getParentalLeavesPeriodsLength(
    @Args('input') input: GetParentalLeavesPeriodsLengthInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfLabourService.getParentalLeavesPeriodsLength(
      user.nationalId,
      input.startDate,
      input.endDate,
      input.percentage,
    )
  }

  @Query(() => [Union], { nullable: true })
  async getUnions(): Promise<Union[] | null> {
    return this.directorateOfLabourService.getUnions()
  }

  @Query(() => [PensionFund], { nullable: true })
  async getPensionFunds(): Promise<PensionFund[] | null> {
    return this.directorateOfLabourService.getPensionFunds()
  }

  @Query(() => [PensionFund], { nullable: true })
  async getPrivatePensionFunds(): Promise<PensionFund[] | null> {
    return this.directorateOfLabourService.getPrivatePensionFunds()
  }

  @Query(() => PregnancyStatus, { nullable: true })
  async getPregnancyStatus(
    @CurrentUser() user: User,
  ): Promise<PregnancyStatus | null> {
    return this.directorateOfLabourService.getPregnancyStatus(user.nationalId)
  }
}
