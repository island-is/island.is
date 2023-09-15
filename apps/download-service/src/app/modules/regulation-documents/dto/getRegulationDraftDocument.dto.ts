import { IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetRegulationDraftDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
