import { ApiProperty } from '@nestjs/swagger'

import { PageInfoDto } from '@island.is/nest/pagination'

import { UserProfileDto } from './user-profile.dto'

export class PaginatedUserProfileDto {
  @ApiProperty({ type: [UserProfileDto] })
  data!: UserProfileDto[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @ApiProperty()
  totalCount!: number
}
