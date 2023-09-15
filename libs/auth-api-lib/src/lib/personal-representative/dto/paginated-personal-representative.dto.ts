import { PageInfoDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeDTO } from './personal-representative.dto'

export class PaginatedPersonalRepresentativeDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [PersonalRepresentativeDTO] })
  data!: PersonalRepresentativeDTO[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
