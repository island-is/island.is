import { ApiProperty } from '@nestjs/swagger'
import { EndorsementTag } from '../../endorsementList/constants'

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

  @ApiProperty({ enum: EndorsementTag, isArray: true })
  tags?: EndorsementTag[]

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  closedDate!: Date

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  openedDate!: Date
}
