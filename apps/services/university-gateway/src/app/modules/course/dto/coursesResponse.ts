import { ApiProperty } from '@nestjs/swagger'
import { PageInfoDto } from '@island.is/nest/pagination'
import { Course } from '../model/course'

export class CoursesResponse {
  @ApiProperty({
    description: 'Course data',
    type: [Course],
  })
  data!: Course[]

  @ApiProperty({
    description: 'Page information (for pagination)',
  })
  pageInfo!: PageInfoDto

  @ApiProperty({
    description: 'Total number of items in result (for pagination)',
  })
  totalCount!: number
}
