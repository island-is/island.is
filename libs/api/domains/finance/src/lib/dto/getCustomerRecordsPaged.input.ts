import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCustomerRecordsPagedInput {
  @Field(() => [String])
  chargeTypeID!: Array<string>

  @Field()
  dayFrom!: string

  @Field()
  dayTo!: string

  @Field(() => String, { nullable: true })
  nextKey?: string
}
