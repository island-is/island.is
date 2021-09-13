import { IsArray } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { CreateFileDto } from './createFile.dto'

export class CreateFilesDto {
  @IsArray()
  @ApiProperty()
  readonly files: CreateFileDto[]
}
