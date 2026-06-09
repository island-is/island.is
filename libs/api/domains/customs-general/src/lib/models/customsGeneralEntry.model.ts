import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralEntry {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  description?: string
}
