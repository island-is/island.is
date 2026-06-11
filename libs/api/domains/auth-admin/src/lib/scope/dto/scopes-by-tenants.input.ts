import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType()
export class ScopesByTenantsInput {
  @Field(() => [String], { nullable: false })
  tenantIds!: string[]

  @Field(() => Environment, { nullable: true })
  environment?: Environment
}
