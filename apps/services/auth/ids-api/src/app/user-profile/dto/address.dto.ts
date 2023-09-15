import { ApiPropertyOptional } from '@nestjs/swagger'

export class AddressDTO {
  @ApiPropertyOptional()
  formatted?: string

  @ApiPropertyOptional()
  streetAddress?: string

  @ApiPropertyOptional()
  locality?: string

  @ApiPropertyOptional()
  region?: string

  @ApiPropertyOptional()
  postalCode?: string

  @ApiPropertyOptional()
  country?: string
}
