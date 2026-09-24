import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { TranslatedValueDto } from '@island.is/auth-api-lib'

export class PublicTenantDto {
  @ApiProperty({ example: '@island.is' })
  name!: string

  @ApiProperty({ type: [TranslatedValueDto] })
  displayName!: TranslatedValueDto[]

  @ApiPropertyOptional({ example: '0123456789' })
  nationalId?: string
}
