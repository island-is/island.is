// FIXME: causes build error in github runner (error: No matching export in "libs/regulations/src/sub/admin.ts" for import "RegulationDraftId")
import { RegulationDraftId } from '@island.is/regulations/admin'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDraftRegulationInput {
  @Field(() => String)
  draftId!: string
  // draftId!: RegulationDraftId
}
