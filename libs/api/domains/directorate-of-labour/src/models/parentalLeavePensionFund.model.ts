import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavePensionFund {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}
