import { IsNumber, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateFileDto {
  @IsString()
  @ApiProperty()
  readonly type!: string

  @IsString()
  @ApiProperty()
  readonly key!: string

  @IsNumber()
  @ApiProperty()
  readonly size!: number
}
