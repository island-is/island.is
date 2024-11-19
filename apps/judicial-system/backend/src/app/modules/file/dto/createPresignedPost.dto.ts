import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreatePresignedPostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly fileName!: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly type!: string
}
