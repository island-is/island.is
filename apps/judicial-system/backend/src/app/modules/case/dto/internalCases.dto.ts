import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class InternalCasesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly nationalId!: string
}
