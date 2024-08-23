import { Field, ObjectType } from '@nestjs/graphql'

import { AuthDelegationType } from '@island.is/clients/auth/delegation-api'

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

  @Field(() => String)
  fromNationalId!: string

  @Field(() => String)
  fromName!: string

  @Field(() => String)
  toNationalId!: string

  @Field(() => String, { nullable: true })
  toName?: string

  @Field(() => String, { nullable: true })
  validTo?: Date

  @Field(() => AuthDelegationType)
  type!: AuthDelegationType

  @Field(() => String, { nullable: true })
  domainName?: string
}
