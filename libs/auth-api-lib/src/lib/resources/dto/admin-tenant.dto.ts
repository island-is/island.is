import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AdminTenantDto {
  @ApiProperty({ example: '@island.is' })
  name!: string

  @ApiProperty({ example: '0123456789' })
  nationalId!: string

  @ApiProperty({ example: 'Mínar síður Ísland.is' })
  displayName!: string

  @ApiPropertyOptional({ example: 'My pages Ísland.is' })
  displayNameEn?: string

  @ApiProperty({ example: 'Domain for Island.is' })
  description!: string

  @ApiPropertyOptional({ example: 'Domain for Island.is' })
  descriptionEn?: string

  @ApiProperty({ example: 'Stafrænt Ísland' })
  organisationLogoKey!: string

  @ApiPropertyOptional({ example: 'island@example.is' })
  contactEmail?: string

  @ApiPropertyOptional({ example: '0000' })
  municipalityCode?: string
}
