import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class BulkVehicleMileageRequestOverviewInput {
  @Field(() => ID)
  guid!: string
}
