import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ExampleProgramTag {
  @ApiProperty({
    description: 'Tag ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @ApiProperty({
    description: 'Tag code',
    example: 'ENGINEER',
  })
  code!: string

  @ApiProperty({
    description: 'Contentful key for tag',
    example: 'engineer',
  })
  contentfulKey!: string
}
