import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetParentalLeavesApplicationPaymentPlanInput {
  @Field(() => String)
  @IsString()
  dateOfBirth!: string

  @Field(() => String)
  @IsString()
  applicationId!: string
}
