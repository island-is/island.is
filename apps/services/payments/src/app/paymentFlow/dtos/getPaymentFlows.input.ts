import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'libs/nest/pagination/src/lib/dto/pagination.dto'

export class GetPaymentFlowsInput extends PaginationDto {
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
}
