import { Environment } from '@island.is/shared/types'
import { Field, ObjectType } from '@nestjs/graphql'
import { ApplicationBasicInfo } from './application-basic-info.model'
import { TranslatedValue } from '../../models/translated-value.model'
import { ApplicationUrl } from './application-applicationUrl.model'
import { ApplicationLifeTime } from './application-lifetime.model'

@ObjectType('AuthAdminApplicationDetailsEnvironment')
export class ApplicationDetailsEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => ApplicationBasicInfo)
  basicInfo!: ApplicationBasicInfo

  @Field(() => [TranslatedValue])
  translations!: TranslatedValue[]

  @Field(() => ApplicationUrl)
  applicationUrls!: ApplicationUrl

  @Field(() => ApplicationLifeTime)
  lifeTime!: ApplicationLifeTime
}
