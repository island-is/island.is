import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UploadPoliceCaseFileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string
}
