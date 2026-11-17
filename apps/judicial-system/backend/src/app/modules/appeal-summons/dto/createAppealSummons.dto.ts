import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class AppealSummonsDefendantDto {
  @IsUUID()
  @ApiProperty({ type: String })
  readonly defendantId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly claims!: string
}

export class CreateAppealSummonsDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly caseName!: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantDto)
  @ApiProperty({ type: AppealSummonsDefendantDto, isArray: true })
  readonly defendants!: AppealSummonsDefendantDto[]
}
