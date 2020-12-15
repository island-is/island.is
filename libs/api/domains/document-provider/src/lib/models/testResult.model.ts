import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TestResult {
  constructor(id: string, isValid: boolean, message?: string) {
    this.id = id
    this.isValid = isValid
    this.message = message
  }

  @Field(() => String)
  id: string

  @Field(() => Boolean)
  isValid: boolean

  @Field(() => String, { nullable: true })
  message?: string
}
