import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  nationalId!: string
}
