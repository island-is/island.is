import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftLawChapterDto {
  @IsUUID()
  @ApiProperty()
  draft_id!: string

  @IsString()
  @ApiProperty()
  law_chapter_id!: string
}
