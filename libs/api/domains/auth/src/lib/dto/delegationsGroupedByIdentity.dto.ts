import { Field, ObjectType, Int } from '@nestjs/graphql'
import { DelegationScope } from '../models/delegationScope.model'

@ObjectType('AuthDelegationsGroupedByIdentity')
export class DelegationsGroupedByIdentity {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => Int)
  totalScopeCount!: number

  @Field(() => [DelegationScope])
  scopes!: DelegationScope[]

  @Field(() => Date, { nullable: true })
  earliestValidFrom?: Date | null

  @Field(() => Date, { nullable: true })
  latestValidTo?: Date | null
}
