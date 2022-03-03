import { ApiProperty } from '@nestjs/swagger'

import { PageInfoDto } from '@island.is/nest/pagination'

import { PersonalRepresentativeAccess } from '../models/personal-representative-access.model'

export class PaginatedPersonalRepresentativeAccessDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeAccess] })
  data!: PersonalRepresentativeAccess[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
