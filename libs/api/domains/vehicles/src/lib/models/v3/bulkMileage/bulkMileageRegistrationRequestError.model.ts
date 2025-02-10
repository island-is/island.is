import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestError {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  message?: string

  @Field(() => Int, { nullable: true })
  warningSerialCode?: number

  @Field({ nullable: true })
  warningText?: string
}
