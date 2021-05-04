import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsBoolean } from 'class-validator'

@InputType()
export class NewDrivingLicenseInput {
  @Field(() => Int)
  @IsInt()
  juristictionId!: number

  @Field()
  @IsBoolean()
  needsToPresentHealthCertificate!: boolean
}
