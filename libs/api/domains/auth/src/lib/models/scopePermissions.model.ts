import { Field, ObjectType } from '@nestjs/graphql'

import { ConsentScopeNode } from './consentScopeNode.model'
import { Domain } from './domain.model'

@ObjectType('AuthScopePermissions')
export class ScopePermissions {
  @Field(() => Domain, { nullable: true })
  owner?: Domain

  @Field(() => [ConsentScopeNode], { nullable: true })
  scopes?: ConsentScopeNode[]

  domainName!: string
}
