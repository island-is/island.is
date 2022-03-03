import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreatePresignedPostDto {
  @IsString()
  @ApiProperty()
  readonly fileName!: string

  @IsString()
  @ApiProperty()
  readonly type!: string
}
