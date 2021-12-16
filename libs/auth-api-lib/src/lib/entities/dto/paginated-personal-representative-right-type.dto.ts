import { PageInfoDto } from '@island.is/nest/pagination'
import { PersonalRepresentativeRightType } from '../models/personal-representative-right-type.model'

export class PaginatedPersonalRepresentativeRightTypeDto {
  totalCount!: number
  data!: PersonalRepresentativeRightType[]
  pageInfo!: PageInfoDto
}
