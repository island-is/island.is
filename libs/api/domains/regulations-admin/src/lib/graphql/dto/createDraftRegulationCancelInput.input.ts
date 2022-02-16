import { ISODate, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDraftRegulationCancelInput {
  @Field(() => String)
  changing_id?: string

  @Field(() => String)
  regulation!: RegName

  @Field(() => Date)
  date!: ISODate
}
