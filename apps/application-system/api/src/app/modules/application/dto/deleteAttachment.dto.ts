import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteAttachmentDto {
  @IsString()
  @ApiProperty()
  readonly key!: string
}
