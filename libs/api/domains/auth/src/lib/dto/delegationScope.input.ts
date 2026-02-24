import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationScopeInput')
export class DelegationScopeInput {
  @Field(() => String)
  name!: string

  @Field(() => Date)
  validTo!: Date
}

@InputType('AuthDelegationScopeWithDomainInput')
export class DelegationScopeWithDomainInput extends DelegationScopeInput {
  @Field(() => String)
  domainName!: string
}
