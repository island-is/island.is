import { ApiProperty } from '@nestjs/swagger'

export class EndorsementMetadata {
  @ApiProperty()
  fullName!: string

  @ApiProperty()
  address!: any

  @ApiProperty()
  bulkEndorsement!: boolean
  invalidated!: boolean
  signedTags!: string
}
