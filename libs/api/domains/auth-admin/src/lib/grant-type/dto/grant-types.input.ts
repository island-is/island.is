import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('AuthAdminGrantTypesInput')
export class GrantTypesInput {
  @Field(() => String, { nullable: true })
  searchString?: string

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  count!: number
}
