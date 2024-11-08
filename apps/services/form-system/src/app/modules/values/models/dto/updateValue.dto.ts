import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'

export class UpdateValueDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ValueType)
  @ApiProperty({ type: ValueType })
  json!: ValueType

  @IsNotEmpty()
  @ApiProperty({ type: Boolean })
  isHidden!: boolean
}
