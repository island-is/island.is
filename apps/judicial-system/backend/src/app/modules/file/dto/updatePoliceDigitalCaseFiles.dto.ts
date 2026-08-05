import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdatePoliceDigitalCaseFileDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly id!: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  readonly orderWithinChapter!: number
}

export class UpdatePoliceDigitalCaseFilesDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePoliceDigitalCaseFileDto)
  @ApiProperty({ type: UpdatePoliceDigitalCaseFileDto, isArray: true })
  readonly files!: UpdatePoliceDigitalCaseFileDto[]
}
