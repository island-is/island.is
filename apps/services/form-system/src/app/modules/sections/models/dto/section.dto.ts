import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class SectionDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @IsString()
  sectionType!: string

  @ApiProperty()
  @IsNumber()
  displayOrder!: number

  @ApiPropertyOptional({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  waitingText?: LanguageType

  @ApiProperty()
  @IsBoolean()
  isHidden!: boolean

  @ApiProperty()
  @IsBoolean()
  isCompleted!: boolean

  @ApiPropertyOptional({ type: [ScreenDto] })
  @ValidateNested()
  @Type(() => ScreenDto)
  @IsOptional()
  screens?: ScreenDto[]
}
