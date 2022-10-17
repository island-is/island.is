import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetInitialScheduleInput, GetScheduleDistributionInput } from './dto'
import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleDistribution,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from './models'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { PaymentScheduleService } from '../payment-schedule.service'
import { UpdateCurrentEmployerInput } from './dto/updateCurrentEmployerInput'
import { UpdateCurrentEmployerResponse } from './models/updateCurrentEmployer.model'
import { GetIsEmployerValidInput } from './dto/isEmployerValidInput'

// @UseGuards(IdsUserGuard, ScopesGuard)
// @Scopes(ApiScope.internal)
@Resolver()
export class PaymentScheduleResolver {
  constructor(private paymentScheduleService: PaymentScheduleService) {}

  @Query(() => PaymentScheduleConditions, {
    name: 'paymentScheduleConditions',
    nullable: true,
  })
  @Audit()
  async conditions(
    @CurrentUser() user: User,
  ): Promise<PaymentScheduleConditions> {
    return await this.paymentScheduleService.getConditions(user)
  }

  @Query(() => [PaymentScheduleDebts], {
    name: 'paymentScheduleDebts',
    nullable: true,
  })
  @Audit()
  async debts(@CurrentUser() user: User): Promise<PaymentScheduleDebts[]> {
    return await this.paymentScheduleService.getDebts(user)
  }

  @Query(() => PaymentScheduleEmployer, {
    name: 'paymentScheduleEmployer',
    nullable: true,
  })
  @Audit()
  async employer(@CurrentUser() user: User): Promise<PaymentScheduleEmployer> {
    return await this.paymentScheduleService.getCurrentEmployer(user)
  }

  @Query(() => PaymentScheduleInitialSchedule, {
    name: 'paymentScheduleInitialSchedule',
    nullable: true,
  })
  @Audit()
  async intitialSchedule(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetInitialScheduleInput })
    input: GetInitialScheduleInput,
  ): Promise<PaymentScheduleInitialSchedule> {
    return await this.paymentScheduleService.getInitalSchedule(user, input)
  }

  @Query(() => PaymentScheduleDistribution, {
    name: 'paymentScheduleDistribution',
    nullable: true,
  })
  @Audit()
  async distribution(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetScheduleDistributionInput })
    input: GetScheduleDistributionInput,
  ): Promise<PaymentScheduleDistribution> {
    return await this.paymentScheduleService.getPaymentDistribution(user, input)
  }

  @Query(() => Boolean, {
    name: 'isEmmployerValid',
  })
  @Audit()
  async employerIsValid(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIsEmployerValidInput })
    input: GetIsEmployerValidInput,
  ): Promise<boolean> {
    return await this.paymentScheduleService.isEmployerValid(
      user,
      input.companyId,
    )
  }

  @Mutation(() => UpdateCurrentEmployerResponse, {
    name: 'updateCurrentEmployer',
  })
  @Audit()
  async updateCurrentEmployer(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateCurrentEmployerInput })
    input: UpdateCurrentEmployerInput,
  ): Promise<UpdateCurrentEmployerResponse> {
    return await this.paymentScheduleService.updateCurrentEmployer(user, input)
  }
}
