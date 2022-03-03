import { ApiProperty } from '@nestjs/swagger'

import { PageInfoDto } from '@island.is/nest/pagination'

import { PersonalRepresentativeType } from '../models/personal-representative-type.model'

export class PaginatedPersonalRepresentativeTypeDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeType] })
  data!: PersonalRepresentativeType[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
