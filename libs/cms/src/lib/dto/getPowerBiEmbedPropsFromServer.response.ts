import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GetPowerBiEmbedPropsFromServerResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string | null

  @Field(() => String, { nullable: true })
  embedUrl?: string | null
}
