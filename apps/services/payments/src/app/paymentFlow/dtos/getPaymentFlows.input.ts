import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber } from 'class-validator'

export class GetPaymentFlowsInput {
  @ApiPropertyOptional({
    description: 'National ID of the payer to filter payment flows',
    type: String,
  })
  @IsOptional()
  @IsString()
  payerNationalId?: string

  @ApiPropertyOptional({
    description: 'Search term to filter payment flows by ID',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: 'Number of items to return per page',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  limit?: number

  @ApiPropertyOptional({
    description: 'Cursor for pagination - get items after this ID',
    type: String,
  })
  @IsOptional()
  @IsString()
  after?: string

  @ApiPropertyOptional({
    description: 'Cursor for pagination - get items before this ID',
    type: String,
  })
  @IsOptional()
  @IsString()
  before?: string
}
