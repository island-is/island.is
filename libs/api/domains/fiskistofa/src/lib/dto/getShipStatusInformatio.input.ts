import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipStatusInformationInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
