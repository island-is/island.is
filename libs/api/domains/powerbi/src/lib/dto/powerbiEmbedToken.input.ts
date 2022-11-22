import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PowerBiEmbedTokenInput {
  @Field()
  something!: string
}
