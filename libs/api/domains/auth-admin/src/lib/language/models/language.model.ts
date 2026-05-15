import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { LanguageEnvironmentData } from './language-environment-data.model'

@ObjectType('AuthAdminLanguage')
export class Language {
  @Field(() => String)
  isoKey!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [LanguageEnvironmentData], { nullable: true })
  environments?: LanguageEnvironmentData[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
