import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('RestoreAuthAdminGrantTypeInput')
export class RestoreGrantTypeInput {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
