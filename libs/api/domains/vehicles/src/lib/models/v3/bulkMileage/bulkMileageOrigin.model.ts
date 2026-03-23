import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageOrigin {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string
}
