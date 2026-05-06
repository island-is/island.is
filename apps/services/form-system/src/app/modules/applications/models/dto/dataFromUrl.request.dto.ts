import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

// export class InputValue {
//   @IsString()
//   @ApiProperty()
//   identifier!: string

//   @ApiProperty({ type: ValueType })
//   @ValidateNested()
//   @Type(() => ValueType)
//   value!: ValueType

//   @IsString()
//   @ApiProperty()
//   fieldType!: string
// }

export class DataFromUrlReqDto {
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  fieldId?: string

  @IsString()
  @ApiProperty()
  slug!: string

  @IsBoolean()
  @ApiProperty()
  isTest!: boolean

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  orgNationalId?: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  identifier?: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  loggedInUserNationalId?: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  applicantNationalId?: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  fieldType?: string

  //   @ApiPropertyOptional({ type: [InputValue] })
  //   @ValidateNested({ each: true })
  //   @Type(() => InputValue)
  //   @IsOptional()
  //   inputValues?: InputValue[]
}
