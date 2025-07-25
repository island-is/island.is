import { ApiProperty } from '@nestjs/swagger'

export class CreateDocumentResponse {
  @ApiProperty({ type: String })
  externalPoliceDocumentId!: string
}
