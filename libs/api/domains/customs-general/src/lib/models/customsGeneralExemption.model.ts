import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralExemption {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  lagaGrein?: string

  @Field(() => String, { nullable: true })
  system?: string
}
