import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestError {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  message?: string
}
