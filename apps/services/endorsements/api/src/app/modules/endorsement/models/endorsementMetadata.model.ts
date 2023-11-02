import { ApiProperty } from '@nestjs/swagger'

export class EndorsementMetadata {
  @ApiProperty()
  fullName!: string

  @ApiProperty()
  locality!: string

  @ApiProperty()
  showName!: boolean
}
