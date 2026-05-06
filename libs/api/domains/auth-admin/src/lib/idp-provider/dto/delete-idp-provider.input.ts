import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminIdpProviderInput')
export class DeleteIdpProviderInput {
  @Field(() => String)
  name!: string

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}
