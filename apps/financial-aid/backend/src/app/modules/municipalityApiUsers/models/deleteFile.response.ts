import { ApiProperty } from '@nestjs/swagger'

export class DeleteApiKeyResponse {
  @ApiProperty()
  success!: boolean
}
