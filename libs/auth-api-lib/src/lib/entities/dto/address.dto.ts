import { ApiPropertyOptional } from '@nestjs/swagger'

export class AddressDTO {
  @ApiPropertyOptional({ type: String })
  formatted?: string | null

  @ApiPropertyOptional({ type: String })
  streetAddress?: string | null

  @ApiPropertyOptional({ type: String })
  locality?: string | null

  @ApiPropertyOptional({ type: String })
  region?: string | null

  @ApiPropertyOptional({ type: String })
  postalCode?: string | null

  @ApiPropertyOptional({ type: String })
  country?: string | null
}
