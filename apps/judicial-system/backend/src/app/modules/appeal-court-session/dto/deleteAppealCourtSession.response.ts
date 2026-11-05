import { ApiProperty } from '@nestjs/swagger'

export class DeleteAppealCourtSessionResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
