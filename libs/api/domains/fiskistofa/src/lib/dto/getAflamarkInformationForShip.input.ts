import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetAflamarkInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
