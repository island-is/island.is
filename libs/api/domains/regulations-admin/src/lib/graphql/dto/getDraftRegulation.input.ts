import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDraftRegulationInput {
  @Field(() => String)
  draftId!: string
}
