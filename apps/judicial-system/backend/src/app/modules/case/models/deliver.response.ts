import { ApiProperty } from '@nestjs/swagger'

export class DeliverResponse {
  @ApiProperty()
  caseFilesDeliveredToCourt!: boolean
}
