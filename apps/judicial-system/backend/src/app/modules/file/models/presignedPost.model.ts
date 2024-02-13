import { ApiProperty } from '@nestjs/swagger'

export class PresignedPost {
  @ApiProperty()
  url!: string

  @ApiProperty()
  fields!: { [key: string]: string }
}
