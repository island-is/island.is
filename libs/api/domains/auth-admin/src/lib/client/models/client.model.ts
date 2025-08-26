import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ClientType } from '../../models/client-type.enum'
import { ClientEnvironment } from './client-environment.model'
import { ClientSso } from '../../models/client-sso.enum'

@ObjectType('AuthAdminClient')
export class Client {
  @Field(() => ID)
  clientId!: string

  @Field(() => ClientType)
  clientType!: ClientType

  @Field(() => ClientSso)
  sso!: ClientSso

  @Field(() => [ClientEnvironment])
  environments!: ClientEnvironment[]
}
