import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
// import { BaseValueType } from '../../../../dataTypes/valueTypes/baseValueType.interface'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Sequelize } from 'sequelize'
import { Type } from 'class-transformer'
import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'

export class UpdateValueDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Sequelize.json)
  @ApiProperty({ type: Sequelize.json })
  json!: ValueType
}
