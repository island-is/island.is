import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DrivingLicenseBookStudentInput {
  @Field()
  nationalId!: string
}
