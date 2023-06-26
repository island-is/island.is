import { IsJWT, IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetVehicleHistoryDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly annualDoc: string | undefined
}
