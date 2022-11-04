import { ApiProperty } from '@nestjs/swagger'

export class DeliverCompletedCaseResponse {
  @ApiProperty()
  caseFilesDeliveredToCourt!: boolean

  @ApiProperty()
  caseDeliveredToPolice!: boolean
}
