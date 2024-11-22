import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreatePresignedPostDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly fileName!: string

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly type!: string
}
