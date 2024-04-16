import { PageInfoDto } from '@island.is/nest/pagination'
import { UserProfileDto } from './user-profile.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class PaginatedUserProfileDto {
  @ApiProperty({ type: [UserProfileDto] })
  data!: UserProfileDto[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @IsNumber()
  @ApiProperty()
  totalCount!: number
}
