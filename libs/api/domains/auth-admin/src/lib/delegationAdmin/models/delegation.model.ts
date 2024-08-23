import { Field, ObjectType } from '@nestjs/graphql'

import { AuthDelegationType } from '@island.is/clients/auth/delegation-api'
import { Identity } from '@island.is/api/domains/identity'

@ObjectType('DelegationAdminCustomModel')
export class DelegationAdminCustomModel {
  @Field(() => [DelegationAdminModel])
  incoming!: DelegationAdminModel[]

  @Field(() => [DelegationAdminModel])
  outgoing!: DelegationAdminModel[]
}

@ObjectType('DelegationAdmin')
export class DelegationAdminModel {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  validTo?: Date

  @Field(() => AuthDelegationType)
  type!: AuthDelegationType

  @Field(() => String, { nullable: true })
  domainName?: string

  @Field(() => Identity)
  to!: Identity

  @Field(() => Identity)
  from!: Identity
}
