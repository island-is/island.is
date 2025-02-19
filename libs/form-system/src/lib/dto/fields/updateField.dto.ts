import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import {
  FieldSettings,
  FieldTypesEnum,
  LanguageType,
} from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateFieldInput')
export class UpdateFieldDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldSettings)
  @ApiPropertyOptional({ type: FieldSettings })
  @Field(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings

  @IsOptional()
  @IsEnum(FieldTypesEnum)
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  fieldType?: string
}
