import { Field, ObjectType } from '@nestjs/graphql'

import { ConsentScope } from './consentScope.model'
import { ConsentScopeGroup } from './consentScopeGroup.model'
import { ConsentScopeTreeNode } from './consentScopeTreeNode.model'
import { Domain } from './domain.model'

@ObjectType('AuthScopePermissions')
export class ScopePermissions {
  @Field(() => Domain, { nullable: true })
  owner?: Domain

  @Field(() => [ConsentScopeTreeNode], { nullable: true })
  scopes?: (ConsentScope | ConsentScopeGroup)[]

  domainId!: string
}
