import { ApiProperty } from '@nestjs/swagger'

export class ExportDataResponse {
  @ApiProperty({ type: String })
  url!: string
}
