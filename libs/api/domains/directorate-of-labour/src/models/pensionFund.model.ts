import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PensionFund {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}
