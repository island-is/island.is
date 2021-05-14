import { IsString, IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetDocumentDto {
  @IsString()
  @ApiProperty()
  readonly documentId!: string

  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
