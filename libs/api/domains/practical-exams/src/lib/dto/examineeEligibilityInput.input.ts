import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsString } from 'class-validator'

@InputType('ExamineeEligibilityInput')
export class ExamineeEligibilityInput {
  @Field(() => [String], { nullable: true })
  @IsArray()
  nationalIds!: string[]

  @Field()
  @IsString()
  xCorrelationID!: string
}
