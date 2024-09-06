import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { DelegationTypeDto } from './delegation-type.dto'

export class DelegationProviderDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
  description!: string

  @ApiProperty({ type: [DelegationTypeDto] })
  delegationTypes!: DelegationTypeDto[]
}
