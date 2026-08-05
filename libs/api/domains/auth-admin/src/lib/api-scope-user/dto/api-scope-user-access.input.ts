import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminApiScopeUserAccessInput')
export class ApiScopeUserAccessInput {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  scope!: string
}
