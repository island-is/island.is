import { RegulationDraftId } from '@island.is/regulations/admin'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteDraftRegulationInput {
  @Field(() => String)
  draftId!: RegulationDraftId
}
