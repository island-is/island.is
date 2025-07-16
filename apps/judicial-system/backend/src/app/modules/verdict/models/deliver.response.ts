import { ApiProperty } from '@nestjs/swagger'

export class DeliverResponse {
  @ApiProperty({ type: Boolean })
  delivered!: boolean
}
