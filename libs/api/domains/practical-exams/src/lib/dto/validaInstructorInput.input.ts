import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('ValidateInstructorInput')
export class ValidateInstrutorInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  xCorrelationID!: string
}
