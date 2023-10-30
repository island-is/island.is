import { ApiProperty } from '@nestjs/swagger'
import { Tag } from '../model/tag'

export class TagResponse {
  @ApiProperty({
    description: 'Tag data',
    type: [Tag],
  })
  data!: Tag[]
}
