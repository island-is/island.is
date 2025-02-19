import { Field, ID, InputType } from '@nestjs/graphql'
import type { Locale } from '@island.is/shared/types'

@InputType()
export class BulkVehicleMileageRequestOverviewInput {
  @Field(() => String)
  locale!: Locale

  @Field(() => ID)
  guid!: string
}
