import { ApiProperty } from '@nestjs/swagger'

export class UploadCriminalRecordFileResponse {
  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  key!: string

  @ApiProperty({ type: Number })
  size!: number

  @ApiProperty({ type: String })
  type!: string
}
