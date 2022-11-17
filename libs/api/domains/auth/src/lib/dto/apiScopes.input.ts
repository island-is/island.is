import { Field, InputType } from '@nestjs/graphql'

import { DomainsControllerFindScopeTreeDirectionEnum } from '@island.is/clients/auth/delegation-api'

import { DomainDirection } from './domainDirection'

@InputType('AuthApiScopesInput')
export class ApiScopesInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => String, { nullable: true })
  domain?: string

  @Field(() => DomainDirection, { nullable: true })
  direction?: DomainsControllerFindScopeTreeDirectionEnum
}
