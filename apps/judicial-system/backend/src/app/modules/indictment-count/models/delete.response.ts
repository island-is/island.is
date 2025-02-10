import { ApiProperty } from '@nestjs/swagger'

export class DeleteResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
