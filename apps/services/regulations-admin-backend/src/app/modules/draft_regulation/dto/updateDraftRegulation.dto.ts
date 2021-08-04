import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateDraftRegulationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly drafting_status?: string

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
  readonly drafting_notes?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ideal_publish_date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ministry_id?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly signature_date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly effective_date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly type?: string

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly authors?: string[]

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly law_chapters?: string[]
}
