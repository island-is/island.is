import { Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateFileDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly id!: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly userGeneratedFilename?: string

  @IsOptional()
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  readonly chapter?: number

  @IsOptional()
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  readonly orderWithinChapter?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly displayDate?: Date
}

export class UpdateFilesDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFileDto)
  @ApiProperty({ type: UpdateFileDto, isArray: true })
  readonly files!: UpdateFileDto[]
}
