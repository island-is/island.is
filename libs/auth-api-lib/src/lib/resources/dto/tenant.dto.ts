import { ApiProperty } from '@nestjs/swagger'

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
