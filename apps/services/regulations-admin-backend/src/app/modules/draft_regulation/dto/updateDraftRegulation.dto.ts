import { IsArray, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateDraftRegulationDto {
  @IsString()
  @ApiProperty()
  readonly draftingStatus!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly name?: string

  @IsString()
  @ApiProperty()
  readonly title!: string

  @IsString()
  @ApiProperty()
  readonly text!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly appendixes?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comments?: string

  @IsString()
  @ApiProperty()
  readonly draftingNotes!: string

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

  @IsOptional()
  @IsArray()
  @ApiProperty()
  authors?: string[]

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly lawChapters?: string[]
}
