import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesPensionFund {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}
