import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralExchangeRate {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  rate?: string
}
