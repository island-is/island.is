import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldTypesEnum } from '../../../../dataTypes/fieldTypes/fieldTypes.enum'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { FieldSettings } from '../../../../dataTypes/fieldSettings/fieldSettings.model'

export class UpdateFieldDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @IsNotEmpty()
  @ApiProperty({ type: Boolean })
  isPartOfMultiset!: boolean

  @IsNotEmpty()
  @ApiProperty({ type: Boolean })
  isRequired!: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldSettings)
  @ApiProperty({ type: FieldSettings })
  fieldSettings?: FieldSettings

  @IsNotEmpty()
  @IsEnum(FieldTypesEnum)
  @ApiProperty({ enum: FieldTypesEnum })
  fieldType!: string
}
