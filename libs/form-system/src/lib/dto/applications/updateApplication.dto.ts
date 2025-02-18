import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Dependency } from '@island.is/form-system-dataTypes'

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
