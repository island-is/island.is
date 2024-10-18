import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageRegistrationRequestStatus {
  @Field(() => ID)
  requestId!: string

  @Field(() => Int, { nullable: true })
  jobsSubmitted?: number

  @Field(() => Int, { nullable: true })
  jobsFinished?: number

  @Field(() => Int, { nullable: true })
  jobsRemaining?: number

  @Field(() => Int, { nullable: true })
  jobsValid?: number

  @Field(() => Int, { nullable: true })
  jobsErrored?: number
}
