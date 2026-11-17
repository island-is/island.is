import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationRequestInput')
export class DelegationRequestInput {
  @Field(() => ID)
  requestId!: string
}

@InputType('AuthApproveDelegationRequestScopeInput')
export class ApproveDelegationRequestScopeInput {
  @Field(() => String)
  name!: string

  @Field(() => Date)
  validTo!: Date
}

@InputType('AuthApproveDelegationRequestInput')
export class ApproveDelegationRequestInput {
  @Field(() => ID)
  requestId!: string

  @Field(() => [ApproveDelegationRequestScopeInput])
  scopes!: ApproveDelegationRequestScopeInput[]
}
