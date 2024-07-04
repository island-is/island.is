import { ApiProperty } from '@nestjs/swagger'
import { University } from '../model/university'

export class UniversitiesResponse {
  @ApiProperty({
    description: 'University data',
    type: [University],
  })
  data!: University[]
}
