import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'

export type TenantEnvironmentId = `${string}#${Environment}`

registerEnumType(Environment, {
  name: 'AuthAdminEnvironment',
})

@ObjectType('AuthAdminTenantEnvironment')
export class TenantEnvironment {
  @Field(() => ID)
  // Setting the id as optional to reuse this type in tenants.service.ts when creating the tenantMap
  id?: TenantEnvironmentId

  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]
}
