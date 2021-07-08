import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftAuthorDto {
  @IsUUID()
  @ApiProperty()
  draft_id!: string

  @IsString()
  @ApiProperty()
  author_id!: string
}
