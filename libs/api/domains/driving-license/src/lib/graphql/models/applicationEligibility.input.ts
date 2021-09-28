import { Field, InputType } from '@nestjs/graphql'
import { DrivingLicenseApplicationFor } from '../../drivingLicense.type'

@InputType()
export class ApplicationEligibilityInput {
  @Field(() => String)
  applicationFor!: DrivingLicenseApplicationFor
}
