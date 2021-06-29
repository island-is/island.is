import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PaymentScheduleAPI } from '@island.is/clients/payment-schedule'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import type { User } from '@island.is/auth-nest-tools'
import { PaymentScheduleConditions } from './models'

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
    const res = await this.paymentScheduleClientApi.getConditions(
      user.nationalId,
    )
    return res.conditions
  }
}
