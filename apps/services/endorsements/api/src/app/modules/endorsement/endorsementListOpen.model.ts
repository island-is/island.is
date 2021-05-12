import { ApiProperty } from '@nestjs/swagger'
import { EndorsementTag } from '../endorsementList/endorsementList.model'

// this exists to provide a pruned version of the endorsement list

export class EndorsementListOpen {
  id!: string
  title!: string

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description!: string | null

  tags?: EndorsementTag[]
}
