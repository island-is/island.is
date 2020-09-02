import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteAttachmentDto {
  @IsString()
  @ApiProperty()
  readonly key: string
}
