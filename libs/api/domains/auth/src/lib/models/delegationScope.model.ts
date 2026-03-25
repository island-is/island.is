import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('AuthDelegationScope')
export class DelegationScope {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => Date, { nullable: true })
  validFrom?: Date

  @Field(() => String, { nullable: true })
  delegationId?: string

  // Internal attributes, used in field resolvers.
  scopeName!: string
  domainName?: string
}
