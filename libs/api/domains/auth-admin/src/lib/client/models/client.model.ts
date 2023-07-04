import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ClientType } from '../../models/client-type.enum'
import { ClientEnvironment } from './client-environment.model'

@ObjectType('AuthAdminClient')
export class Client {
  @Field(() => ID)
  clientId!: string

  @Field(() => ClientType)
  clientType!: ClientType

  @Field(() => [ClientEnvironment])
  environments!: ClientEnvironment[]

  @Field(() => ClientEnvironment)
  defaultEnvironment?: ClientEnvironment

  @Field(() => [Environment])
  availableEnvironments?: Environment[]
}
