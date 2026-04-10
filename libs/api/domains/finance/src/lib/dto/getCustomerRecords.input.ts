import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { FinanceApiVersion } from '../enums'

registerEnumType(FinanceApiVersion, { name: 'FinanceApiVersion' })

@InputType()
export class GetCustomerRecordsInput {
  @Field(() => [String], { nullable: true })
  chargeTypeID!: Array<string>

  @Field()
  dayFrom!: string

  @Field()
  dayTo!: string
}
