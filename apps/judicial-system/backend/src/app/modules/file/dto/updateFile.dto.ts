import { Type } from 'class-transformer'
import {
  Allow,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateFileDto {
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly userGeneratedFilename?: string

  @IsOptional()
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  readonly chapter?: number

  @IsOptional()
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  readonly orderWithinChapter?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly displayDate?: Date
}

export class UpdateFilesDto {
  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFileDto)
  @ApiProperty()
  readonly files!: UpdateFileDto[]
}
