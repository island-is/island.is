import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { ProgramBase } from '../model/program'

export class ProgramsResponse {
  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
  })
  totalCount!: number

  @ApiProperty({
    description: 'Program data',
    type: [ProgramBase],
  })
  data!: ProgramBase[]

  @ApiProperty({
    description: 'Page information (for pagination)',
  })
  pageInfo!: PageInfoDto
}
