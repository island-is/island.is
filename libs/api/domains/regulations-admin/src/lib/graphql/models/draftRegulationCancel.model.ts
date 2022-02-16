// FIXME: causes build error in github runner (error: No matching export in "libs/regulations/src/sub/admin.ts" for import "RegulationDraftId")
import { ISODate, RegName } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DraftRegulationCancelModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  changing_id!: string

  @Field(() => String)
  regulation!: RegName

  @Field(() => Date)
  date!: ISODate
}
