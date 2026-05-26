import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminIdpProviderListItem')
export class IdpProviderListItem {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => String)
  description!: string

  @Field(() => String)
  helptext!: string

  @Field(() => Int)
  level!: number
}
