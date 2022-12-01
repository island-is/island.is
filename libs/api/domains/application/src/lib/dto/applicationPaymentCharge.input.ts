import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class ApplicationPaymentChargeInput {
  @Field()
  @IsString()
  applicationId!: string

  @Field(() => [String], { nullable: false })
  chargeItemCodes!: string[]

  // TODO: charge parameters for other types of payments
}
