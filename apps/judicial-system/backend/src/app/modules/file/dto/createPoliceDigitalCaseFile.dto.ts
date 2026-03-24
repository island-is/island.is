import { Type } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePoliceDigitalCaseFileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly policeCaseNumber!: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly policeDigitalFileId!: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly policeExternalVendorId!: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly name!: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly displayDate?: Date

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  readonly orderWithinChapter?: number
}
