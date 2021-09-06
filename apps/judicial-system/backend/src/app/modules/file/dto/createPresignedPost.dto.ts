import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreatePresignedPostDto {
  @IsString()
  @ApiProperty()
  readonly fileName!: string
}
