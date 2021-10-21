import { Field, InputType } from '@nestjs/graphql'
import type { DrivingLicenseApplicationType } from '../../drivingLicense.type'

@InputType()
export class ApplicationEligibilityInput {
  @Field(() => String)
  applicationFor!: DrivingLicenseApplicationType
}
