import { PageInfoDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeAccessDTO } from './personal-representative-access.dto'

export class PaginatedPersonalRepresentativeAccessDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeAccessDTO] })
  data!: PersonalRepresentativeAccessDTO[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
