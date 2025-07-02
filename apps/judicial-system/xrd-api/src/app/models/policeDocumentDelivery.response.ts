import { ApiProperty } from '@nestjs/swagger'

// TODO: what response is useful for RLS to get after an successful update?
export class PoliceDocumentDelivery {
  @ApiProperty({ type: String })
  policeDocumentId!: string
}
