import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemCreateFormApplicantType')
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

@InputType('FormSystemCreateFormApplicantTypeInput')
export class CreateFormApplicantTypeInput {
  @Field(() => CreateFormApplicantTypeDto, { nullable: true })
  createFormApplicantTypeDto?: CreateFormApplicantTypeDto
}
