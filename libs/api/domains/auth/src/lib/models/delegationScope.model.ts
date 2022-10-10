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

  // Attributes returned from APIs.
  scopeName!: string
  domainName?: string
}
