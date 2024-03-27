import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { Program, ProgramBase } from '../model/program'

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

export class ApplicationProgramsResponse {
  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
  })
  totalCount!: number

  @ApiProperty({
    description: 'Program application data',
    type: [Program],
  })
  data!: Program[]

  @ApiProperty({
    description: 'Page information (for pagination)',
  })
  pageInfo!: PageInfoDto
}
