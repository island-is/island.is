import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType('FormSystemFormApplicantType')
export class FormApplicantTypeDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  applicantTypeId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType
}
