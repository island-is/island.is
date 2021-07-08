import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationDto {
  @IsString()
  @ApiProperty()
  readonly drafting_status!: string

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
  @IsDate()
  @ApiProperty()
  readonly ideal_publish_date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ministry_id?: string

  @IsOptional()
  @IsDate()
  @ApiProperty()
  readonly signature_date?: Date

  @IsOptional()
  @IsDate()
  @ApiProperty()
  readonly effective_date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly type?: string
}
