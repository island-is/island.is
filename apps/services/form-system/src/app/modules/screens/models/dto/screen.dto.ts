import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldDto } from '../../../fields/models/dto/field.dto'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ScreenDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  sectionId!: string

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  displayOrder!: number

  @ApiProperty()
  @IsBoolean()
  isHidden!: boolean

  @ApiProperty()
  @IsBoolean()
  isCompleted!: boolean

  @ApiProperty()
  @IsNumber()
  multiset!: number

  @ApiProperty()
  @IsBoolean()
  callRuleset!: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: [FieldDto] })
  @ValidateNested()
  @Type(() => FieldDto)
  fields?: FieldDto[]
}
