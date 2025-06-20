import { ApiProperty } from '@nestjs/swagger'

class SearchItem {
  @ApiProperty({ type: String, description: 'The case id' })
  readonly caseId!: string

  @ApiProperty({ type: String, description: 'The case descriptor' })
  readonly descriptor!: string
}

export class SearchResponse {
  @ApiProperty({
    type: Number,
    description: 'The total number of search results',
  })
  readonly rowCount!: number

  @ApiProperty({
    type: SearchItem,
    isArray: true,
    description: 'The search results',
  })
  readonly rows!: SearchItem[]
}
