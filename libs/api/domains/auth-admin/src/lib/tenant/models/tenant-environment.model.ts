import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'

export type TenantEnvironmentId = `${string}#${Environment}`

registerEnumType(Environment, {
  name: 'AuthAdminEnvironment',
})

@ObjectType('AuthAdminTenantEnvironment')
export class TenantEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  // Per-environment admin fields. Nullable so the slim list query stays
  // backward compatible – they are only populated by the admin details query.
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  organisationLogoKey?: string

  @Field({ nullable: true })
  contactEmail?: string
}
