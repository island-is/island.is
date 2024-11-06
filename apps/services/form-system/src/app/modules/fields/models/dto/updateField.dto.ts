import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
// import { UpdateFieldSettingsDto } from '../../../fieldSettings/models/dto/updateFieldSettings.dto'
import { FieldTypes } from '../../../../enums/fieldTypes'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { FieldSettingsType } from '../../../../dataTypes/fieldSettingsTypes/fieldSettingsType.model'

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
  @Type(() => FieldSettingsType)
  @ApiProperty({ type: FieldSettingsType })
  fieldSettingsType?: FieldSettingsType

  @IsNotEmpty()
  @IsEnum(FieldTypes)
  @ApiProperty({ enum: FieldTypes })
  fieldType!: string
}
