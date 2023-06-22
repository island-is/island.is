import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class University {
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @ApiProperty({
    description: 'University national ID',
    example: '123456-7890',
  })
  nationalId!: string

  @ApiProperty({
    description:
      'University name (Note: this should not be used, only returned here for convenience)',
    example: 'Háskóli Íslands',
  })
  name!: string

  @ApiProperty({
    description: 'Contentful key for university',
    example: 'UniversityOfIceland',
  })
  @ApiPropertyOptional()
  contentfulKey?: string
}

export class UniversityResponse {
  @ApiProperty({
    description: 'University data',
    type: [University],
  })
  data!: University[]
}
