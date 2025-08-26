import { ApiProperty } from '@nestjs/swagger'

export class CreateSubpoenaResponse {
  @ApiProperty({ type: String })
  policeSubpoenaId!: string
}
