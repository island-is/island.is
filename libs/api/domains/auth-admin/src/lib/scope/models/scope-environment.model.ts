import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminScopeEnvironment')
export class ScopeEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => [TranslatedValue], { nullable: false })
  displayName!: TranslatedValue[]

  @Field(() => [TranslatedValue], { nullable: false })
  description!: TranslatedValue[]
}
