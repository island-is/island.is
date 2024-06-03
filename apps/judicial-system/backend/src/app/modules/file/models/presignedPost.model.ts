import { ApiProperty } from '@nestjs/swagger'

export class PresignedPost {
  @ApiProperty({ type: String })
  url!: string

  @ApiProperty({ type: Object })
  fields!: { [key: string]: string }

  @ApiProperty({ type: String })
  key!: string
}
