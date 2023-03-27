import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ClientType } from '../../models/client-type.enum'
import { TranslatedValue } from '../../models/translated-value.model'
import { ApplicationUrl } from './application-applicationUrl.model'
import { ApplicationLifeTime } from './application-lifetime.model'
import { ApplicationBasicInfo } from './application-basic-info.model'

@ObjectType('AuthAdminClientEnvironment')
export class ClientEnvironment {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  clientId!: string

  @Field(() => Environment)
  environment!: Environment

  @Field(() => ClientType)
  clientType!: ClientType

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  //
  // @Field(() => ApplicationUrl)
  // applicationUrls!: ApplicationUrl
  //
  // @Field(() => ApplicationLifeTime)
  // lifeTime!: ApplicationLifeTime
  //
  // @Field(() => ApplicationBasicInfo)
  // basicInfo!: ApplicationBasicInfo
}
