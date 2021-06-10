import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationScopeInput')
export class DelegationScopeInput {
  @Field((_) => String)
  name!: string

  @Field((_) => Date, { nullable: true })
  validTo?: Date
}
