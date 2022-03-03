import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddAttachmentDto {
  @IsString()
  @ApiProperty()
  readonly key!: string

  @IsString()
  @ApiProperty()
  readonly url!: string
}
