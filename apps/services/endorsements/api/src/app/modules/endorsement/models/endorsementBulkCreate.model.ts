import { ApiProperty } from '@nestjs/swagger'
import { Endorsement } from './endorsement.model'

class NationalIdError {
  @ApiProperty()
  nationalId!: string

  @ApiProperty()
  message!: string
}

export class EndorsementBulkCreate {
  @ApiProperty({ type: [Endorsement] })
  succeeded!: Endorsement[]

  @ApiProperty({ type: [NationalIdError] })
  failed!: NationalIdError[]
}
