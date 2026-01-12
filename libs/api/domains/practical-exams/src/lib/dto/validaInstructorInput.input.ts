import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('ValidateInstructorInput')
export class ValidateInstructorInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  xCorrelationID!: string
}
