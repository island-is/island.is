import { ApiProperty } from '@nestjs/swagger'

export class DeleteCourtSessionResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
