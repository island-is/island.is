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
}
