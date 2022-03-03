import { ApiProperty } from '@nestjs/swagger'
import { IsJWT,IsString } from 'class-validator'

export class GetDocumentDto {
  @IsString()
  @ApiProperty()
  readonly documentId!: string

  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
