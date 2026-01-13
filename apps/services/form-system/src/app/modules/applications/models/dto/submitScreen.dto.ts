import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { SectionDto } from '../../../sections/models/dto/section.dto'

export class SubmitScreenDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  applicationId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  screenId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sectionId?: string

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  increment?: boolean

  @ValidateNested()
  @Type(() => SectionDto)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]
}
