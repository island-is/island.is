import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemCreateFormApplicantTypeInput')
export class CreateFormApplicantTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  applicantTypeId!: string
}
