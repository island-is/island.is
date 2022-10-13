import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateFileDto {
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly userGeneratedFilename?: string | null

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  readonly chapter?: number | null

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  readonly orderWithinChapter?: number | null
}
