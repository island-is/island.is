import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'
import { ApplicationEventDto } from '../../../applications/models/dto/applicationEvent.dto'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class ValueDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsNumber()
  order!: number

  @ApiPropertyOptional({ type: ValueType })
  @ValidateNested()
  @Type(() => ValueType)
  @IsOptional()
  json?: ValueType

  @ApiPropertyOptional({ type: [ApplicationEventDto] })
  @ValidateNested()
  @IsOptional()
  @Type(() => ApplicationEventDto)
  events?: ApplicationEventDto[]
}
