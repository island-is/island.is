import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthRequestDelegationScopeInput')
export class RequestDelegationScopeInput {
  @Field(() => String)
  scopeName!: string

  @Field(() => Date, { nullable: true })
  validTo?: Date | null
}

@InputType('AuthCreateDelegationRequestInput')
export class CreateDelegationRequestInput {
  @Field(() => String)
  toGranterNationalId!: string

  @Field(() => String, { nullable: true })
  domainName?: string

  @Field(() => String)
  relationship!: string

  @Field(() => String)
  reason!: string

  @Field(() => [RequestDelegationScopeInput])
  scopes!: RequestDelegationScopeInput[]
}
