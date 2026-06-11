import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminGrantTypeInput')
export class CreateGrantTypeInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
