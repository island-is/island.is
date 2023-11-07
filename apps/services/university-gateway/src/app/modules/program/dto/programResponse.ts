import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { Program } from '../model/program'

export class ProgramResponse {
  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
  })
  totalCount!: number

  @ApiProperty({
    description: 'Program data',
    type: [Program],
  })
  data!: Program[]

  @ApiProperty({
    description: 'Page information (for pagination)',
  })
  pageInfo!: PageInfoDto
}
