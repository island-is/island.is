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
import { ParentalLeaveEntitlement } from '../models/parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from '../models/parentalLeavePaymentPlan.model'
import { PregnancyStatus } from '../models/pregnancyStatus.model'
import { ParentalLeave } from '../models/parentalLeave.model'
import { ParentalLeavePeriodEndDate } from '../models/parentalLeavePeriodEndDate.model'
import { ParentalLeavePeriodLength } from '../models/parentalLeavePeriodLength.model'
import { GetParentalLeavesEntitlementsInput } from '../dto/getParentalLeavesEntitlements.input'
import { GetParentalLeavesEstimatedPaymentPlanInput } from '../dto/getParentalLeavesEstimatedPaymentPlan.input'
import { GetParentalLeavesApplicationPaymentPlanInput } from '../dto/getParentalLeavesApplicationPaymentPlan.input'
import { GetParentalLeavesPeriodEndDateInput } from '../dto/getParentalLeavesPeriodEndDate.input'
import { GetParentalLeavesPeriodLengthInput } from '../dto/getParentalLeavesPeriodLength.input'
import { DirectorateOfLabourService } from './directorate-of-labour.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class DirectorateOfLabourResolver {
  constructor(private directorateOfLabourService: DirectorateOfLabourService) {}

  @Query(() => ParentalLeaveEntitlement, { nullable: true })
  async getParentalLeavesEntitlements(
    @Args('input') input: GetParentalLeavesEntitlementsInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeaveEntitlement | null> {
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

  @Query(() => [ParentalLeavePaymentPlan], { nullable: true })
  async getParentalLeavesEstimatedPaymentPlan(
    @Args('input') input: GetParentalLeavesEstimatedPaymentPlanInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeavePaymentPlan[] | null> {
    return this.directorateOfLabourService.getParentalLeavesEstimatedPaymentPlan(
      input.dateOfBirth,
      input.period,
      user.nationalId,
    )
  }

  @Query(() => [ParentalLeavePaymentPlan], { nullable: true })
  async getParentalLeavesApplicationPaymentPlan(
    @Args('input') input: GetParentalLeavesApplicationPaymentPlanInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeavePaymentPlan[] | null> {
    return this.directorateOfLabourService.getParentalLeavesApplicationPaymentPlan(
      input.dateOfBirth,
      input.applicationId,
      user.nationalId,
    )
  }

  @Query(() => ParentalLeavePeriodEndDate)
  async getParentalLeavesPeriodEndDate(
    @Args('input') input: GetParentalLeavesPeriodEndDateInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfLabourService.getParentalLeavesPeriodEndDate(
      user.nationalId,
      input.startDate,
      input.length,
      input.percentage,
    )
  }

  @Query(() => ParentalLeavePeriodLength)
  async getParentalLeavesPeriodLength(
    @Args('input') input: GetParentalLeavesPeriodLengthInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfLabourService.getParentalLeavesPeriodLength(
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
