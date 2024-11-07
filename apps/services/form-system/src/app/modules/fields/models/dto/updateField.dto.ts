import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
// import { UpdateFieldSettingsDto } from '../../../fieldSettings/models/dto/updateFieldSettings.dto'
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

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => UpdateFieldSettingsDto)
  // @ApiProperty({ type: UpdateFieldSettingsDto })
  // fieldSettings?: UpdateFieldSettingsDto

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
