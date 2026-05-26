import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

class ReorderIndictmentCountItemDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly id!: string

  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  readonly displayOrder!: number
}

export class ReorderIndictmentCountsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderIndictmentCountItemDto)
  @ApiProperty({ type: ReorderIndictmentCountItemDto, isArray: true })
  readonly counts!: { id: string; displayOrder: number }[]
}
