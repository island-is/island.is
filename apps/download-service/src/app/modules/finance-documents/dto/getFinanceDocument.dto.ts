import { IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetFinanceDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
