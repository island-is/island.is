import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PersonalRepresentativeDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'guid',
  })
  readonly id?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Personal Representative',
  })
  readonly nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Represented Person',
  })
  readonly nationalIdRepresentedPerson!: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["health", "finance"]',
  })
  readonly rightCodes!: string[]
}
