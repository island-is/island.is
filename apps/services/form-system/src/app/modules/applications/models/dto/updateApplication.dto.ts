import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]

  @Type(() => String)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  completed?: string[]
}
