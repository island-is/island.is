import { ISODate } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationByDateInput {
  @Field()
  regulationName!: string
  @Field()
  date!: string
}
