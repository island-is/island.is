import { Field, ObjectType } from '@nestjs/graphql'

import { ConsentScopeNode } from './consentScopeNode.model'
import { Domain } from './domain.model'

@ObjectType('AuthConsentTenant')
export class ConsentTenant {
  @Field(() => Domain, { nullable: true })
  owner?: Domain

  @Field(() => [ConsentScopeNode], { nullable: true })
  scopes?: ConsentScopeNode[]

  domainName!: string
}
