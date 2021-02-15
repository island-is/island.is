import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadSignedDocumentDto {
  @IsString()
  @ApiProperty()
  readonly documentToken!: string
}
