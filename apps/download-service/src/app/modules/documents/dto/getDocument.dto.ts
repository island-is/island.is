import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetDocumentDto {
  @IsString()
  @Length(10)
  @ApiProperty()
  readonly documentId!: string

  @IsString()
  @Length(10)
  @ApiProperty()
  readonly token!: string
}
