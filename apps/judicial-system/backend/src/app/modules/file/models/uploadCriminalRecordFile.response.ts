import { ApiProperty } from '@nestjs/swagger'

export class UploadCriminalRecordFileResponse {
  @ApiProperty({ type: String })
  key!: string

  @ApiProperty({ type: Number })
  size!: number
}
