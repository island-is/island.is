import { PaymentScheduleAPI } from '@island.is/clients/payment-schedule'
import { Query, Resolver } from '@nestjs/graphql'
import { PaymentScheduleConditions, PaymentScheduleDebts } from './models'
import { PaymentScheduleEmployer } from './models/employer.model'

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
}
