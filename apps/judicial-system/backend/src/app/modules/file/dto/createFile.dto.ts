import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseFileCategory } from '@island.is/judicial-system/types'

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly type!: string

  @IsOptional()
  @IsEnum(CaseFileCategory)
  @ApiPropertyOptional({ enum: CaseFileCategory })
  readonly category?: CaseFileCategory

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly key!: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number })
  readonly size!: number

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  readonly chapter?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  readonly orderWithinChapter?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly displayDate?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly policeFileId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly userGeneratedFilename?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly submissionDate?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly fileRepresentative?: string

  /**********
   * For appeal-related files belonging to a ruling-order appeal: the id of
   * the COURT_INDICTMENT_RULING_ORDER file being appealed. NULL for case-
   * level appeal files and any other case files.
   **********/
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly rulingFileId?: string
}
