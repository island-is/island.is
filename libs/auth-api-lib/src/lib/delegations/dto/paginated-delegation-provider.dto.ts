import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { PageInfoDto } from '@island.is/nest/pagination'
import { DelegationProviderDto } from './delegation-provider.dto'

export class PaginatedDelegationProviderDto {
  @ApiProperty({ type: [DelegationProviderDto], nullable: true })
  data!: DelegationProviderDto[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @IsNumber()
  @ApiProperty()
  totalCount!: number
}
