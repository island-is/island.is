import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PageInfo {
  @ApiProperty({
    description:
      'Boolean flag to indicate if there exists more items before the current set of data received',
    example: true,
  })
  hasPreviousPage!: boolean

  @ApiProperty({
    description:
      'Boolean flag to indicate if there exists more items after the current set of data received',
    example: true,
  })
  hasNextPage!: boolean

  @ApiProperty({
    description:
      'Base64 encoded strings. The client uses these values in following request to get the previous page',
    example: 'aWQ6MTAwMQ==',
  })
  @ApiPropertyOptional()
  startCursor?: string

  @ApiProperty({
    description:
      'Base64 encoded strings. The client uses these values in following request to get the next page',
    example: 'aWQ6MTAwMw==',
  })
  endCursor?: string
}
