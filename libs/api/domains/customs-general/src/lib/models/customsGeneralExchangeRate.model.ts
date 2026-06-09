import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralExchangeRate {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String)
  rate!: string

  @Field(() => Date)
  validFrom!: Date

  @Field(() => Date)
  validTo!: Date

  @Field(() => String)
  tableId!: string

  @Field(() => Date)
  changedDate!: Date

  @Field(() => String)
  system!: string
}
