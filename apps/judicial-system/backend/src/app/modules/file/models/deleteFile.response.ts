import { ApiProperty } from '@nestjs/swagger'

export class DeleteFileResponse {
  @ApiProperty()
  success!: boolean
}
