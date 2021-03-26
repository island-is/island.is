import { IsString, IsJWT, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetDocumentDto {
  @IsString()
  @Length(10)
  @ApiProperty()
  readonly documentId!: string

  @IsJWT()
  @ApiProperty()
  readonly token!: string
}
