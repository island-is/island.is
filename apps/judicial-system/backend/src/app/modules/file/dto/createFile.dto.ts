import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseFileSubtype } from '@island.is/judicial-system/types'

export class CreateFileDto {
  @IsString()
  @ApiProperty()
  readonly type!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: CaseFileSubtype })
  readonly subtype?: CaseFileSubtype

  @IsString()
  @ApiProperty()
  readonly key!: string

  @IsNumber()
  @ApiProperty()
  readonly size!: number
}
