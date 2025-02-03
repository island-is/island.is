import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'

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
  @ApiPropertyOptional({ type: String })
  text?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  number?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  date?: Date

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  listValue?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  address?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  postalCode?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  municipality?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  jobTitle?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  altName?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  homestayNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  propertyNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  totalDays?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  totalAmount?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  year?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  isNullReport?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => Month)
  @IsArray()
  @ApiPropertyOptional({ type: [Month] })
  months?: Month[]

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  email?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  iskNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  checkboxValue?: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  phoneNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  bankAccount?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  time?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  s3Key?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  s3Url?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  paymentCode?: string
}
