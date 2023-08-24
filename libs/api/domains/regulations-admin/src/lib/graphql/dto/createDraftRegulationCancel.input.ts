import { ISODate, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDraftRegulationCancelInput {
  @Field(() => String)
  changingId!: string

  @Field(() => String)
  regulation!: RegName

  @Field(() => String)
  date!: ISODate
}
