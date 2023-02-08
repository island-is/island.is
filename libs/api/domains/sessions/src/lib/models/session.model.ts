import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Client } from '@island.is/api/domains/auth'
import { Identity } from '@island.is/api/domains/identity'

@ObjectType('SessionsSession')
export class Session {
  @Field(() => ID)
  id!: string

  @Field(() => Identity)
  actor!: Identity

  @Field(() => Identity)
  subject!: Identity

  @Field(() => Client)
  client!: Client

  @Field(() => String)
  timestamp!: string

  @Field(() => String)
  userAgent!: string

  @Field(() => String)
  ip!: string

  @Field(() => String, { nullable: true })
  ipLocation?: string
}
