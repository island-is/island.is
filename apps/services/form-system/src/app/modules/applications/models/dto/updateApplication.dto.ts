import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [Dependency] })
  dependencies!: Dependency[]
}
