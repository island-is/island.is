import { ApiProperty } from '@nestjs/swagger'

export class DeleteIndictmentCountResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
