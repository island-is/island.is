import { ISODate } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegulationsMinistriesInput {
  @Field()
  test?: string
}
