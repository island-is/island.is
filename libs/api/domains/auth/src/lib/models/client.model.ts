import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Domain } from './domain.model'

@ObjectType('AuthClient')
export class Client {
  @Field(() => ID)
  clientId!: string

  @Field(() => String, { nullable: true })
  clientName?: string

  @Field(() => String, { nullable: true })
  domainName?: string

  @Field(() => Domain, { nullable: true })
  domain?: Domain
}
