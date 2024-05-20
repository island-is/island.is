import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Lawyer {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  practice?: string
}
