import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AddAttachmentDto {
  @IsString()
  @ApiProperty()
  readonly key: string

  @IsString()
  @ApiProperty()
  readonly url: string
}
