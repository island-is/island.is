import { RegulationDraftId } from '@island.is/regulations/admin'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteDraftRegulationModel {
  @Field(() => String)
  id!: RegulationDraftId
}
