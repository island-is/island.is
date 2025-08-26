import { ApiProperty } from '@nestjs/swagger'

export class PoliceDocumentDelivery {
  @ApiProperty({ type: String })
  policeDocumentId!: string
}
