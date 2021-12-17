import { PageInfoDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeRightType } from '../models/personal-representative-right-type.model'

export class PaginatedPersonalRepresentativeRightTypeDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeRightType] })
  data!: PersonalRepresentativeRightType[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
