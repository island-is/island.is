import { ISODate, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationFromApiInput {
  @Field(() => String)
  regulation!: RegName

  @Field(() => String, { nullable: true })
  date?: ISODate
}
