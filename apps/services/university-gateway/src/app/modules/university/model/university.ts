import { ApiProperty } from '@nestjs/swagger'

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
}

export class UniversityResponse {
  @ApiProperty({
    description: 'University data',
    type: [University],
  })
  data!: University[]
}
