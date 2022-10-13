import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator'

export class UpdateFileDto {
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly userGeneratedFilename?: string | null

  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional()
  readonly chapter?: number | null

  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional()
  readonly orderWithinChapter?: number | null
}
