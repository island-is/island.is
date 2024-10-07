import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { UpdateFieldSettingsDto } from '../../../fieldSettings/models/dto/updateFieldSettings.dto'
import { FieldTypes } from '../../../../enums/fieldTypes'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

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
  @ApiProperty()
  isPartOfMultiset!: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFieldSettingsDto)
  @ApiProperty({ type: UpdateFieldSettingsDto })
  fieldSettings?: UpdateFieldSettingsDto

  @IsNotEmpty()
  @IsEnum(FieldTypes)
  @ApiProperty({ enum: FieldTypes })
  fieldType!: string
}
