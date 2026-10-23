import { ApiProperty } from '@nestjs/swagger'

export class ReplaceIndictmentPdfResponse {
  @ApiProperty({ type: Boolean })
  success!: boolean
}
