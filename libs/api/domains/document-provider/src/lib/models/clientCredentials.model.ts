import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ClientCredentials {
  constructor(clientId: string, clientSecret: string, providerId: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.providerId = providerId
  }

  @Field(() => String)
  clientId: string

  @Field(() => String)
  clientSecret: string

  @Field(() => String)
  providerId: string
}
