import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Client } from './client.model'
import { ConsentTenant } from './consentTenants.model'

@ObjectType('AuthConsent')
export class Consent {
  @Field(() => Client, { nullable: true })
  client?: Client

  @Field(() => [ConsentTenant], { nullable: true })
  tenants?: ConsentTenant[]

  clientId!: string
  consentedScopes!: string[]
  rejectedScopes!: string[]
}
