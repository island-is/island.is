import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteDraftRegulationInput {
  @Field(() => String)
  draftId!: string
}
