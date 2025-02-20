import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemCreateFormCertificationType')
export class CreateFormCertificationTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  certificationTypeId!: string
}

@InputType('FormSystemCreateFormCertificationTypeInput')
export class CreateFormCertificationTypeInput {
  @Field(() => CreateFormCertificationTypeDto, { nullable: true })
  createFormCertificationTypeDto?: CreateFormCertificationTypeDto
}
