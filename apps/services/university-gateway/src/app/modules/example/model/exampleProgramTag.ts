import { ApiProperty } from '@nestjs/swagger'

export class ExampleProgramTag {
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  @ApiProperty({
    description: 'Tag ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  tagId!: string
}

export class ExampleTag {
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
    description: 'Tag name (Icelandic)',
    example: 'Verkfræði',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Tag name (English)',
    example: 'Engineer',
  })
  nameEn!: string
}
