import { ApiProperty } from '@nestjs/swagger'

export class DeleteDefendantResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
