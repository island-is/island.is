import { ApiProperty } from '@nestjs/swagger'

export class UploadPoliceCaseFileResponse {
  @ApiProperty()
  key!: string

  @ApiProperty()
  size!: number
}
