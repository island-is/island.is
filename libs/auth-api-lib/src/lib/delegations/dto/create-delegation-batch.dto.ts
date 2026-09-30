import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator'

import { CreateDelegationDTO } from './delegation.dto'

export class CreateDelegationBatchDTO {
  @ApiProperty({
    description:
      'Delegations to create or update, one entry per (recipient, domain).',
    type: [CreateDelegationDTO],
  })
  @Type(() => CreateDelegationDTO)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  delegations!: CreateDelegationDTO[]
}
