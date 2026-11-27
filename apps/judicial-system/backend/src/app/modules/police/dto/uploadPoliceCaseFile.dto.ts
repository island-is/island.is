import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UploadPoliceCaseFileDto {
  // The police system identifies its documents by a number
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^\d+$/)
  @ApiProperty({ type: String })
  readonly id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string
}
