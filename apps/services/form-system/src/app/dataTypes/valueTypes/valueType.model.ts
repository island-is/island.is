import { ApiPropertyOptional } from '@nestjs/swagger'

class Month {
  @ApiPropertyOptional()
  month?: number

  @ApiPropertyOptional()
  amount?: number

  @ApiPropertyOptional({ type: [Number] })
  days?: number[]
}

export class ValueType {
  @ApiPropertyOptional()
  text?: string

  @ApiPropertyOptional()
  number?: number

  @ApiPropertyOptional()
  date?: Date

  @ApiPropertyOptional()
  kennitala?: string

  @ApiPropertyOptional()
  name?: string

  @ApiPropertyOptional()
  address?: string

  @ApiPropertyOptional()
  postalCode?: string

  @ApiPropertyOptional()
  municipality?: string

  @ApiPropertyOptional()
  jobTitle?: string

  @ApiPropertyOptional()
  altName?: string

  @ApiPropertyOptional()
  homestayNumber?: string

  @ApiPropertyOptional()
  totalDays?: number

  @ApiPropertyOptional()
  totalAmount?: number

  @ApiPropertyOptional()
  year?: number

  @ApiPropertyOptional()
  isNullReport?: boolean

  @ApiPropertyOptional({ type: [Month] })
  months?: Month[]
}
