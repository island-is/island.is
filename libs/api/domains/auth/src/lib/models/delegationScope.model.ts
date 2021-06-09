import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('AuthDelegationScope')
export class DelegationScope {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => Date)
  validTo!: Date
}
