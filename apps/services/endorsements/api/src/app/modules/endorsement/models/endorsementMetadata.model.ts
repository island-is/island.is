import { ApiProperty } from '@nestjs/swagger'

export class EndorsementMetadata {
  @ApiProperty()
  fullName!: string

  @ApiProperty()
  showName!: boolean
}
