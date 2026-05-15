import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { EnvironmentFailure } from '../../shared/models/multi-environment-result.model'
import { TranslationEnvironmentData } from './translation-environment-data.model'

@ObjectType('AuthAdminTranslation')
export class Translation {
  @Field(() => String)
  language!: string

  @Field(() => String)
  className!: string

  @Field(() => String)
  property!: string

  @Field(() => String)
  key!: string

  @Field(() => [Environment], { nullable: true })
  availableEnvironments?: Environment[]

  @Field(() => [TranslationEnvironmentData], { nullable: true })
  environments?: TranslationEnvironmentData[]

  @Field(() => [EnvironmentFailure], { nullable: true })
  failedEnvironments?: EnvironmentFailure[]
}
