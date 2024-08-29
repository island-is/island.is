import { Field, ObjectType } from '@nestjs/graphql'
import { CustomDelegation } from '@island.is/api/domains/auth'

@ObjectType('DelegationAdminCustomModel')
export class DelegationAdminCustomModel {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => [CustomDelegation])
  incoming!: CustomDelegation[]

  @Field(() => [CustomDelegation])
  outgoing!: CustomDelegation[]
}
