import { PersonalRepresentativeRightTypeDTO } from './personal-representative-right-type.dto'
import { PageInfoDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'

export class PaginatedPersonalRepresentativeRightTypeDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeRightTypeDTO] })
  data!: PersonalRepresentativeRightTypeDTO[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
