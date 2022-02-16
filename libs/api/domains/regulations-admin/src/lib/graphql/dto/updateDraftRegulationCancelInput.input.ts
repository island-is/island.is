import { ISODate } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateDraftRegulationCancelInput {
  @Field(() => String)
  id!: string

  @Field(() => Date)
  date!: ISODate
}
