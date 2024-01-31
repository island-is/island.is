import { ApiProperty } from '@nestjs/swagger'

export class UploadFileToCourtResponse {
  @ApiProperty()
  success!: boolean
}
