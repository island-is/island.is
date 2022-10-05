import { ApiProperty } from '@nestjs/swagger'

export class DeliverProsecutorDocumentsResponse {
  @ApiProperty()
  requestDeliveredToCourt!: boolean
}
