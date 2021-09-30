import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'
import { Endorsement } from '../models/endorsement.model'
import { PageInfoDto } from '../../pagination/dto/pageinfo.dto'

export class PaginatedEndorsementDto {
  @ApiProperty()
  totalCount!: number
  @ApiProperty({ type: [Endorsement] })
  data!: Endorsement[]
  @ApiProperty()
  pageInfo!: PageInfoDto
}
