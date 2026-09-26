import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../models/translated-value.model'

@ObjectType('PublicAuthTenant')
export class PublicAuthTenant {
  @Field(() => ID)
  id!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => [Environment])
  availableEnvironments!: Environment[]
}

@ObjectType('PublicAuthScope')
export class PublicAuthScope {
  @Field(() => ID)
  scopeName!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => [TranslatedValue])
  description!: TranslatedValue[]

  @Field(() => [Environment])
  availableEnvironments!: Environment[]
}
