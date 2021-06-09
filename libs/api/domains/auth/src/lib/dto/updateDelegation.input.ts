import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationScopeInput')
class Scope {
  @Field((_) => String)
  name!: string

  @Field((_) => Date)
  validTo!: Date
}

@InputType('UpdateAuthDelegationInput')
export class UpdateDelegationInput {
  @Field((_) => String)
  id!: string

  @Field((_) => [Scope])
  scopes!: Scope[]
}
