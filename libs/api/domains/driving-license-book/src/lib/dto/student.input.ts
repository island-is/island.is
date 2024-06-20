import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DrivingLicenseBookStudentInput {
  @Field()
  nationalId!: string

  @Field(() => String, { nullable: true })
  licenseCategory?: 'B' | 'BE'
}
