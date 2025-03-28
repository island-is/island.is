import { ApiProperty } from '@nestjs/swagger'

export class DeleteVictimResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
