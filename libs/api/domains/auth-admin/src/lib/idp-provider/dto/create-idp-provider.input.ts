import { Field, InputType, Int } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminIdpProviderInput')
export class CreateIdpProviderInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  helptext!: string

  @Field(() => Int)
  level!: number

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
