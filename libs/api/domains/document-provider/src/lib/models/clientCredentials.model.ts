import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ClientCredentials {
  @Field(() => String)
  clientId!: string

  @Field(() => String)
  clientSecret!: string
}
