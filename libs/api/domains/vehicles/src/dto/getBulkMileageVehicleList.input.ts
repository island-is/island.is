import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetBulkMileageVehicleListInput {
  @Field()
  pageSize!: number

  @Field()
  page!: number
}
