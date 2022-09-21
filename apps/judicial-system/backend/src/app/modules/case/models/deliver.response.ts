import { ApiProperty } from '@nestjs/swagger'

export class DeliverResponse {
  @ApiProperty()
  rulingDeliveredToCourt!: boolean

  @ApiProperty()
  courtRecordDeliveredToCourt!: boolean

  @ApiProperty()
  caseFilesDeliveredToCourt!: boolean

  @ApiProperty()
  caseDeliveredToPolice!: boolean
}
