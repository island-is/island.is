import { IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetWorkMachineCollectionDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
