import { PageInfoDto } from '@island.is/nest/pagination'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'

export class PaginatedPersonalRepresentativeDto {
  totalCount!: number
  data!: PersonalRepresentativeDTO[]
  pageInfo!: PageInfoDto
}
