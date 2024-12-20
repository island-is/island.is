import { ApiProperty } from '@nestjs/swagger'

export class DeleteCivilClaimantResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
