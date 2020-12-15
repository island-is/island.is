import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ClientCredentials {
  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  @Field(() => String)
  clientId: string

  @Field(() => String)
  clientSecret: string
}
