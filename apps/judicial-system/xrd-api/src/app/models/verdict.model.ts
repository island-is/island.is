import { ApiProperty } from '@nestjs/swagger'

// TODO
export class VerdictResponse {
  @ApiProperty({ type: String })
  nationalId!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  practice!: string
}
