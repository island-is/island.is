import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreatePresignedPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly fileName!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly type!: string
}
