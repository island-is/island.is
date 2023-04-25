import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Client } from './client.model'
import { ScopePermissions } from './scopePermissions.model'

@ObjectType('AuthConsent')
export class Consent {
  @Field(() => Client, { nullable: true })
  client?: Client

  @Field(() => [ScopePermissions], { nullable: true })
  permissions?: ScopePermissions[]

  clientId!: string
  consentedScopes!: string[]
  rejectedScopes!: string[]
}
