import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationDto {
  @IsString()
  @ApiProperty()
  readonly draftingStatus!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly text?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly draftingNotes?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly idealPublishDate?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ministryId?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly signatureDate?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly effectiveDate?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly type?: string
}
