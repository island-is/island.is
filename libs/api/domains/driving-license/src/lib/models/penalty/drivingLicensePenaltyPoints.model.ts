import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicensePenaltyPointDetail } from './drivingLicensePenaltyPointDetail.model'

@ObjectType()
export class DrivingLicensePenaltyPoints {
  @Field()
  isDeprived!: boolean

  @Field(() => [DrivingLicensePenaltyPointDetail], { nullable: true })
  details?: DrivingLicensePenaltyPointDetail[]
}
