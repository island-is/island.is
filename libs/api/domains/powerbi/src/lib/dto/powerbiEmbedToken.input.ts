import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PowerBiEmbedTokenInput {
  @Field()
  workspaceId!: string

  @Field()
  reportId!: string

  @Field()
  owner!: 'Fiskistofa'
}
