import { ApiProperty } from '@nestjs/swagger'

import { Items } from './items.model'

export class Groups {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: [Items] })
  items!: Items[]
}
