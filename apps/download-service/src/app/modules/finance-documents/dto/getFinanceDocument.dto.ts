import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsJWT, IsOptional,IsString } from 'class-validator'

export class GetFinanceDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly annualDoc: string | undefined
}
