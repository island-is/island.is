import { Field, InputType } from '@nestjs/graphql'

@InputType()
class Scopes {
  @Field((_) => String)
  name!: string

  @Field((_) => Date)
  validTo!: Date
}

@InputType('UpdateAuthDelegationInput')
export class UpdateDelegationInput {
  @Field((_) => String)
  id!: string

  @Field((_) => [Scopes])
  scopes!: Scopes[]
}
