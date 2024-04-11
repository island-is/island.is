import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { PageInfoDto } from '@island.is/nest/pagination'

export class ActorProfileDto {
  @ApiProperty()
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean
}

export class PatchActorProfileDto {
  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean
}

export class PaginatedActorProfileDto {
  @ApiProperty({ type: [ActorProfileDto] })
  data!: ActorProfileDto[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @IsNumber()
  @ApiProperty()
  totalCount!: number
}
