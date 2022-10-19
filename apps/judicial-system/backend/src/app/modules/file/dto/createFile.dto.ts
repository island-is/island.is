import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseFileCategory } from '@island.is/judicial-system/types'

export class CreateFileDto {
  @IsString()
  @ApiProperty()
  readonly type!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: CaseFileCategory })
  readonly category?: CaseFileCategory

  @IsString()
  @ApiProperty()
  readonly key!: string

  @IsNumber()
  @ApiProperty()
  readonly size!: number

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber?: string
}
