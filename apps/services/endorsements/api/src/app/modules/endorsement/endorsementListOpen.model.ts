import { ApiProperty } from '@nestjs/swagger'
import { EndorsementTag } from '../endorsementList/endorsementList.model'

// this exists to provide a pruned version of the endorsement list

export class EndorsementListOpen {
  @ApiProperty()
  id!: string

  @ApiProperty()
  title!: string

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description!: string | null

  @ApiProperty()
  tags?: EndorsementTag[]
}
