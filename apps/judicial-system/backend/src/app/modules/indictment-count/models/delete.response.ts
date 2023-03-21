import { ApiProperty } from '@nestjs/swagger'

export class DeleteIndictmentCountResponse {
  @ApiProperty()
  deleted!: boolean
}
