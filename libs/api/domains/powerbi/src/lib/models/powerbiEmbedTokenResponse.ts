import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PowerBiEmbedTokenResponse {
  @Field(() => String, { nullable: true })
  token?: string | null

  @Field(() => String, { nullable: true })
  embedUrl?: string | null
}
