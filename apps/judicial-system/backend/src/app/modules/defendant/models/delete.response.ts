import { ApiProperty } from '@nestjs/swagger'

export class DeleteDefendantResponse {
  @ApiProperty()
  deleted!: boolean
}
