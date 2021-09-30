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
    type: String,
    nullable: true,
  })
  closedDate!: Date | null

  @ApiProperty({
    type: String,
    nullable: true,
  })
  openedDate!: Date | null
}
