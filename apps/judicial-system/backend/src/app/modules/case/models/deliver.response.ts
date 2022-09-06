import { ApiProperty } from '@nestjs/swagger'

export class DeliverResponse {
  @ApiProperty()
  signedRulingDeliveredToCourt!: boolean

  @ApiProperty()
  courtRecordDeliveredToCourt!: boolean

  @ApiProperty()
  caseFilesDeliveredToCourt!: boolean

  @ApiProperty()
  caseDeliveredToPolice!: boolean
}
