import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateInvoiceResponse {
  @ApiProperty({
    description: 'Indicates if the transaction was successful',
    type: Boolean,
  })
  @IsBoolean()
  isSuccess!: boolean

  @ApiPropertyOptional({
    description: 'Response code from the charge',
    type: String,
  })
  @IsOptional()
  @IsString()
  responseCode?: string

  @ApiProperty({ description: 'Correlation ID for tracking', type: String })
  @IsString()
  correlationId!: string
}
