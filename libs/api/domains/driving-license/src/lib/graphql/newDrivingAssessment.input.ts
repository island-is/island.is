import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'
import { IsNationalId } from './validators/nationalIdValidator'

@InputType()
export class NewDrivingAssessmentInput {
  @Field()
  @IsNotEmpty()
  @IsNationalId()
  studentNationalId!: string
}
