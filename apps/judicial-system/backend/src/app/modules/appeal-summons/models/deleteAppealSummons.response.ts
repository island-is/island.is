import { ApiProperty } from '@nestjs/swagger'

export class DeleteAppealSummonsResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
