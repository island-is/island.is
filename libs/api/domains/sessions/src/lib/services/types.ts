import { PageInfoDto } from '@island.is/nest/pagination'

export class SessionDto {
  id!: string

  actorNationalId!: string

  subjectNationalId!: string

  clientId!: string

  timestamp!: string

  userAgent!: string

  ip!: string

  ipLocation!: string
}

export class PaginatedSessionDto {
  totalCount!: number

  pageInfo!: PageInfoDto

  data!: SessionDto[]
}
