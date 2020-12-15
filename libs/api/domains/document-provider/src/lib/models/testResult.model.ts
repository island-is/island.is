import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TestResult {
  @Field(() => String)
  id!: string

  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => String)
  message!: string
}
