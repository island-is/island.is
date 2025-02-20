import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateFormApplicantType')
export class UpdateFormApplicantTypeDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType
}

@InputType('FormSystemUpdateFormApplicantTypeInput')
export class UpdateFormApplicantTypeInput {
  @Field(() => String)
  id!: string

  @Field(() => UpdateFormApplicantTypeDto, { nullable: true })
  updateFormApplicantTypeDto?: UpdateFormApplicantTypeDto
}
