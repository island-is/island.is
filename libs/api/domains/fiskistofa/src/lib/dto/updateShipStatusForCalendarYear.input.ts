import { Field, InputType } from '@nestjs/graphql'
import { FiskistofaCategoryChange } from './updateShipStatusForTimePeriod.input'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class FiskistofaUpdateShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @CacheField(() => [FiskistofaCategoryChange])
  changes!: FiskistofaCategoryChange[]
}
