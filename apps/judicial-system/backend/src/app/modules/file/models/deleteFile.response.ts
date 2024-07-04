import { ApiProperty } from '@nestjs/swagger'

export class DeleteFileResponse {
  @ApiProperty({ type: Boolean })
  success!: boolean
}
