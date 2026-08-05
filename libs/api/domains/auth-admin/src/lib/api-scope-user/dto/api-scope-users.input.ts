import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('AuthAdminApiScopeUsersInput')
export class ApiScopeUsersInput {
  @Field(() => String, { nullable: true })
  searchString?: string

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  count!: number
}
