import { ApiProperty } from '@nestjs/swagger'

export class EventLogResponse {
  @ApiProperty({ type: Boolean })
  success!: boolean
}
