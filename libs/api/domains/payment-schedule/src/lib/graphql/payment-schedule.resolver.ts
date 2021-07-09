import { PaymentScheduleAPI } from '@island.is/clients/payment-schedule'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetInitialScheduleInput, GetScheduleDistributionInput } from './dto'
import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleDistribution,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from './models'

// @UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PaymentScheduleResolver {
  constructor(private paymentScheduleClientApi: PaymentScheduleAPI) {}

  @Query(() => PaymentScheduleConditions, {
    name: 'paymentScheduleConditions',
    nullable: true,
  })
  // @Audit()
  async conditions(): Promise<PaymentScheduleConditions> {
    return await this.paymentScheduleClientApi.getConditions('2704685439')
  }

  @Query(() => [PaymentScheduleDebts], {
    name: 'paymentScheduleDebts',
    nullable: true,
  })
  // @Audit()
  async debts(): Promise<PaymentScheduleDebts[]> {
    return await this.paymentScheduleClientApi.getDebts('2704685439')
  }

  @Query(() => PaymentScheduleEmployer, {
    name: 'paymentScheduleEmployer',
    nullable: true,
  })
  // @Audit()
  async employer(): Promise<PaymentScheduleEmployer> {
    const employerResponse = await this.paymentScheduleClientApi.getCurrentEmployer(
      '2704685439',
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
  // @Audit()
  async intitialSchedule(
    @Args('input', { type: () => GetInitialScheduleInput })
    input: GetInitialScheduleInput,
  ): Promise<PaymentScheduleInitialSchedule> {
    return await this.paymentScheduleClientApi.getInitalSchedule({
      nationalId: '2704685439',
      ...input,
    })
  }

  @Query(() => PaymentScheduleDistribution, {
    name: 'paymentScheduleDistribution',
    nullable: true,
  })
  // @Audit()
  async distribution(
    @Args('input', { type: () => GetScheduleDistributionInput })
    input: GetScheduleDistributionInput,
  ): Promise<PaymentScheduleDistribution> {
    return await this.paymentScheduleClientApi.getPaymentDistribtion({
      nationalId: '2704685439',
      ...input,
    })
  }
}
