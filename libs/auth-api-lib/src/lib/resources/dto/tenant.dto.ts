import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'

export class TenantDto {
  @ApiProperty({ example: '@island.is' })
  name!: string

  @ApiProperty({
    type: TranslatedValueDto,
    isArray: true,
    example: 'Ísland.is mínar síður',
  })
  displayName!: TranslatedValueDto[]

  @ApiProperty({
    example: 'island@example.is',
  })
  contactEmail?: string
}

export class AdminTenantDto extends TenantDto {
  @ApiPropertyOptional({ example: '0123456789' })
  nationalId?: string
}
