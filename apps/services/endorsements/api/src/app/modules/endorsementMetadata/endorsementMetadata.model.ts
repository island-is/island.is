import { ApiProperty } from '@nestjs/swagger'
import { EndorsementTag } from '../endorsementList/constants'
import { TemporaryVoterRegistryResponse } from './providers/temporaryVoterRegistry/temporaryVoterRegistry.service'

export class EndorsementMetadata {
  @ApiProperty()
  fullName!: string

  @ApiProperty()
  address!: any

  @ApiProperty()
  bulkEndorsement!: boolean

  @ApiProperty()
  invalidated!: boolean

  @ApiProperty({ enum: EndorsementTag, isArray: true })
  signedTags!: EndorsementTag[]

  @ApiProperty()
  voterRegion!: TemporaryVoterRegistryResponse
}
