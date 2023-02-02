import { ApiProperty } from '@nestjs/swagger'

import { PageInfo } from '@island.is/nest/pagination'

import { Session } from './session.model'

export class SessionsResultDto {
  @ApiProperty({ required: true })
  totalCount!: number

  @ApiProperty({ type: () => [Session], required: true })
  data!: Session[]

  @ApiProperty({ required: true })
  pageInfo!: PageInfo
}
