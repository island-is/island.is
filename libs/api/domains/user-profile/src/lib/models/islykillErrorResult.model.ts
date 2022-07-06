import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IslykillErrorResult {
  @Field(() => String)
  message!: string

  @Field(() => String)
  code!: number

  @Field(() => [String])
  invalidFields!: string[]
}
