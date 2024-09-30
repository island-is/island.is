import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class GetFinanceDocumentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly annualDoc: string | undefined
}
