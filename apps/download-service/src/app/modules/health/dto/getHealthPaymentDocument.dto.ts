import { IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetGetHealthPaymentDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
