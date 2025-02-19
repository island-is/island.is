import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemCreateFormCertificationTypeInput')
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
