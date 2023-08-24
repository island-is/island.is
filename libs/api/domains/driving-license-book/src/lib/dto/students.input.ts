import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DrivingLicenseBookStudentsInput {
  @Field()
  key!: string

  @Field()
  licenseCategory!: string

  @Field()
  cursor!: string

  @Field()
  limit!: number
}
