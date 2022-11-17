import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
import { Type } from 'class-transformer'

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
  @Min(0)
  @ApiPropertyOptional()
  readonly chapter?: number | null

  @IsOptional()
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  readonly orderWithinChapter?: number | null

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly displayDate?: string | null
}

export class UpdateFilesDto {
  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFileDto)
  @ApiProperty()
  readonly files!: UpdateFileDto[]
}
