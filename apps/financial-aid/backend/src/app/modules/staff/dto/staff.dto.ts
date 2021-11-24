import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class StaffQueryInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string
}
