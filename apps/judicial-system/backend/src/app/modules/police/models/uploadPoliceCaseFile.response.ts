import { ApiProperty } from '@nestjs/swagger'

export class UploadPoliceCaseFileResponse {
  @ApiProperty({ type: String })
  key!: string

  @ApiProperty({ type: Number })
  size!: number
}
