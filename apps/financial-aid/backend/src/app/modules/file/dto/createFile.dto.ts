import { IsNumber, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { FileType } from '@island.is/financial-aid/shared/lib'

export class CreateFileDto {
  @IsString()
  @ApiProperty()
  readonly applicationId: string

  @IsString()
  @ApiProperty()
  readonly name: string

  @IsString()
  @ApiProperty()
  readonly key: string

  @IsNumber()
  @ApiProperty()
  readonly size: number

  @IsString()
  @ApiProperty()
  readonly type: FileType
}
