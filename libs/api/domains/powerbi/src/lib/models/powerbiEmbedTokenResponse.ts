import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PowerBiEmbedTokenResponse {
  @Field()
  token!: string
}
