import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OJOIAGetDraftRegulationInput {
  @Field()
  draftId!: string
}
