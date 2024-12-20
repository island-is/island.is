import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class BulkVehicleMileageRequestStatusInput {
  @Field(() => ID)
  requestId!: string
}
