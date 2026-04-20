import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminApiScopeUserInput')
export class DeleteApiScopeUserInput {
  @Field(() => String)
  nationalId!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
