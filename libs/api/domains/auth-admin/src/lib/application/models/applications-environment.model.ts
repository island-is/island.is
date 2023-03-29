import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'
import { ApplicationUrl } from './application-applicationUrl.model'
import { ApplicationLifeTime } from './application-lifetime.model'
import { ApplicationBasicInfo } from './application-basic-info.model'

@ObjectType('AuthAdminApplicationEnvironment')
export class ApplicationEnvironment {
  @Field(() => ID)
  id!: string

  @Field(() => Environment)
  environment!: Environment

  @Field()
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => ApplicationUrl)
  applicationUrls!: ApplicationUrl

  @Field(() => ApplicationLifeTime)
  lifeTime!: ApplicationLifeTime

  @Field(() => ApplicationBasicInfo)
  basicInfo!: ApplicationBasicInfo
}
