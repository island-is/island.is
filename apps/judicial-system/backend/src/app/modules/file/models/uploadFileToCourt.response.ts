import { ApiProperty } from '@nestjs/swagger'

export class UploadFileToCourtResponse {
  @ApiProperty({ type: Boolean })
  success!: boolean
}
