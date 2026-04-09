import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminTenantInput')
export class CreateTenantInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  organisationLogoKey!: string

  @Field(() => String, { nullable: true })
  contactEmail?: string

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]
}
