import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class Month {
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  month?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  amount?: number | null

  @IsOptional()
  @ApiPropertyOptional({ type: [Number] })
  days?: number[]
}

export class ValueType {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  text?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  number?: number

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @ApiPropertyOptional({ type: Date })
  date?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  listValue?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  address?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  postalCode?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  municipality?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  jobTitle?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  altName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  homestayNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  propertyNumber?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  totalDays?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  totalAmount?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  year?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isNullReport?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => Month)
  @IsArray()
  @ApiPropertyOptional({ type: [Month] })
  months?: Month[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  iskNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  checkboxValue?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  phoneNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  bankAccount?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  time?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  s3Key?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  s3Url?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  paymentCode?: string
}
