import { PaymentScheduleAPI } from '@island.is/clients/payment-schedule'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetInitialScheduleInput, GetScheduleDistributionInput } from './dto'
import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleDistribution,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from './models'
import { Audit } from '@island.is/nest/audit'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentScheduleResolver {
  constructor(private paymentScheduleClientApi: PaymentScheduleAPI) {}

  @Query(() => PaymentScheduleConditions, {
    name: 'paymentScheduleConditions',
    nullable: true,
  })
  @Audit()
  async conditions(
    @CurrentUser() user: User,
  ): Promise<PaymentScheduleConditions> {
    return await this.paymentScheduleClientApi.getConditions(user.nationalId)
  }

  @Query(() => [PaymentScheduleDebts], {
    name: 'paymentScheduleDebts',
    nullable: true,
  })
  @Audit()
  async debts(@CurrentUser() user: User): Promise<PaymentScheduleDebts[]> {
    return await this.paymentScheduleClientApi.getDebts(user.nationalId)
  }

  @Query(() => PaymentScheduleEmployer, {
    name: 'paymentScheduleEmployer',
    nullable: true,
  })
  @Audit()
  async employer(@CurrentUser() user: User): Promise<PaymentScheduleEmployer> {
    const employerResponse = await this.paymentScheduleClientApi.getCurrentEmployer(
      user.nationalId,
    )
    return {
      name: employerResponse.employerName,
      nationalId: employerResponse.employerNationalId,
    }
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
    return await this.paymentScheduleClientApi.getInitalSchedule({
      nationalId: user.nationalId,
      ...input,
    })
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
    return await this.paymentScheduleClientApi.getPaymentDistribtion({
      nationalId: user.nationalId,
      ...input,
    })
  }
}
