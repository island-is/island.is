import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UUIDV4 } from 'sequelize'

export class UpdateApplicationDto {
  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @ValidateNested()
  @Type(() => UUIDV4)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [UUIDV4] })
  completed?: string[]
}
