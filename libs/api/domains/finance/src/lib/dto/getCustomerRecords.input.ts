import { Field, InputType } from '@nestjs/graphql'

@InputType('FinanceCustomerRecordsInput')
export class GetCustomerRecordsInput {
  @Field(() => [String], { nullable: true })
  chargeTypeID!: Array<string>

  @Field()
  dayFrom!: string

  @Field()
  dayTo!: string
}
