import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ApiScopeGroup } from './apiScopeGroup.model'
import { Domain } from './domain.model'

@ObjectType('AuthApiScope')
export class ApiScope {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => ApiScopeGroup, { nullable: true })
  group?: ApiScopeGroup

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Domain, { nullable: true })
  domain?: Domain

  @Field(() => Boolean)
  allowsWrite!: boolean

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Whether granting this scope as a delegation requires a separate high-assurance confirmation (tvöfalt samþykki).',
  })
  requiresConfirmation?: boolean

  @Field(() => String, {
    nullable: true,
    description: 'URL to redirect to for third party delegation login',
  })
  thirdPartyLoginUrl?: string

  constructor(apiScope: ApiScope) {
    Object.assign(this, apiScope)
  }
}
