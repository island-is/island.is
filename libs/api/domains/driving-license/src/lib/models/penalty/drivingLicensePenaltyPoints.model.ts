import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicensePenaltyPointDetail } from './drivingLicensePenaltyPointDetail.model'

@ObjectType()
export class DrivingLicensePenaltyPoints {
  @Field({
    description:
      'True if the driver is currently deprived of their driving licence due to penalty points exceeding the threshold.',
  })
  isDeprived!: boolean

  @Field(() => [DrivingLicensePenaltyPointDetail], { nullable: true })
  details?: DrivingLicensePenaltyPointDetail[]
}
