import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { Kennitala } from '@island.is/regulations'

export class CreateDraftAuthorDto {
  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
  authorId!: Kennitala
}
