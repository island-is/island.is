import { PageInfoDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeTypeDTO } from './personal-representative-type.dto'

export class PaginatedPersonalRepresentativeTypeDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeTypeDTO] })
  data!: PersonalRepresentativeTypeDTO[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
