import { ISODate, RegName, PlainText } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DraftRegulationCancelModel {
  @Field()
  id!: string

  @Field()
  changingId!: string

  @Field(() => String)
  regulation!: RegName

  @Field(() => Date)
  date!: ISODate
}
