import { ApiProperty } from '@nestjs/swagger'
import { University } from '../model/university'

export class UniversityResponse {
  @ApiProperty({
    description: 'University data',
    type: [University],
  })
  data!: University[]
}
