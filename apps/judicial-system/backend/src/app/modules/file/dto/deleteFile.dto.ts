import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DeleteFileDto {
  @IsString()
  @ApiProperty()
  readonly id: string
}
