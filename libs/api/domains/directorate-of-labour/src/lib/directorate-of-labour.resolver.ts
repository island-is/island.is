import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { DirectorateOfLabourService } from './directorate-of-labour.service'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Union } from './union.model'
import { PensionFund } from './pensionFund.model'
import { GetParentalLeavesEntitlementsInput } from '../dto/getParentalLeavesEntitlements.input'
import { ParentalLeaveEntitlement } from './parentalLeaveEntitlement.model'
import { GetParentalLeavesEstimatedPaymentPlanInput } from '../dto/getParentalLeavesEstimatedPaymentPlan.input'
import { ParentalLeavePaymentPlan } from './parentalLeavePaymentPlan.model'
import { GetParentalLeavesApplicationPaymentPlanInput } from '../dto/getParentalLeavesApplicationPaymentPlan.input'
import { ParentalLeavePregnancyStatus } from './parentalLeavePregnancyStatus.model'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class DirectorateOfLabourResolver {
  constructor(private directorateOfLabourService: DirectorateOfLabourService) {}

  @Query(() => [ParentalLeaveEntitlement], { nullable: true })
  async getParentalLeavesEntitlements(
    @Args('input') input: GetParentalLeavesEntitlementsInput,
    @CurrentUser() user: User,
  ): Promise<ParentalLeaveEntitlement[] | null> {
    return this.directorateOfLabourService.getParentalLeavesEntitlements(
      input.dateOfBirth,
      user.nationalId,
    )
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

  @Query(() => ParentalLeavePregnancyStatus, { nullable: true })
  async getParentalLeavePregnancyStatus(
    @CurrentUser() user: User,
  ): Promise<ParentalLeavePregnancyStatus | null> {
    return this.directorateOfLabourService.getParentalLeavePregnancyStatus(
      user.nationalId,
    )
  }
}
