import { ApiProperty } from '@nestjs/swagger'

export class Defender {
  @ApiProperty({ type: String })
  nationalId!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  practice!: string
}
