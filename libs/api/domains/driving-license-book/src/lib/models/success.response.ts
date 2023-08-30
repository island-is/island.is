import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseBookSuccess {
  @Field()
  success?: boolean
}
