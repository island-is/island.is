import { Field, ObjectType } from '@nestjs/graphql'

import { ConsentScopeNode } from './consentScopeNode.model'

@ObjectType('AuthConsentTenant')
export class ConsentTenant {
  @Field(() => [ConsentScopeNode], { nullable: true })
  scopes?: ConsentScopeNode[]

  domainName!: string
}
