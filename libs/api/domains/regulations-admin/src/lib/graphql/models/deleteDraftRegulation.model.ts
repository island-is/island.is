// FIXME: causes build error in github runner (error: No matching export in "libs/regulations/src/sub/admin.ts" for import "RegulationDraftId")
import { RegulationDraftId } from '@island.is/regulations/admin'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteDraftRegulationModel {
  @Field(() => String)
  id!: string
  // id!: RegulationDraftId
}
