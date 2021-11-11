import { IsJWT, IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetFinanceDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly annualDoc: string | undefined
}
