import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Dependency } from '../../../../dataTypes/dependency.model'

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

  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  pruneAt?: Date
}
