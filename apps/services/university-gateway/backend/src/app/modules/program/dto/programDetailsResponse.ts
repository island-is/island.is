import { ApiProperty } from '@nestjs/swagger'
import { ProgramDetails } from '../model/program'

export class ProgramDetailsResponse {
  @ApiProperty({
    description: 'Program data',
    type: ProgramDetails,
  })
  data!: ProgramDetails
}
