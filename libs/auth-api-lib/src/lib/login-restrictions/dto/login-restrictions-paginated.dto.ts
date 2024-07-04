import { ApiProperty } from '@nestjs/swagger'

import { PageInfoDto } from '@island.is/nest/pagination'

import { LoginRestrictionDto } from './login-restriction.dto'

export class LoginRestrictionsPaginatedDto {
  @ApiProperty()
  pageInfo!: PageInfoDto

  @ApiProperty()
  totalCount!: number

  @ApiProperty({ type: [LoginRestrictionDto] })
  data!: LoginRestrictionDto[]
}
