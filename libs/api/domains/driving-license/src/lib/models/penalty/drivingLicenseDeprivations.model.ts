import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseDeprivation } from './drivingLicenseDeprivation.model'

@ObjectType()
export class DrivingLicenseDeprivations {
  @Field(() => DrivingLicenseDeprivation, {
    nullable: true,
    description:
      'The most recent driving license deprivation, or null if the user has none',
  })
  current?: DrivingLicenseDeprivation

  @Field(() => [DrivingLicenseDeprivation], {
    description:
      'All driving license deprivations except the most recent (current) one',
  })
  history!: DrivingLicenseDeprivation[]
}
