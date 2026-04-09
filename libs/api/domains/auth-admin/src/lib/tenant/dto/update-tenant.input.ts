import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminTenantInput')
export class UpdateTenantInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  displayName?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  organisationLogoKey?: string

  @Field(() => String, { nullable: true })
  contactEmail?: string
}
