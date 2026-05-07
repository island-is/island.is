import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminGrantTypeInput')
export class DeleteGrantTypeInput {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
