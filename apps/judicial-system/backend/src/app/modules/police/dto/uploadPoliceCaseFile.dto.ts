import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UploadPoliceCaseFileDto {
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsString()
  @ApiProperty()
  readonly name!: string
}
