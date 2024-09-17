import { IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'

export class DeliverDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User
}
