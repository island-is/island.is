import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ApiScopeBaseDTO } from '../../dto/base/api-scope-base.dto'
import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'

export class AdminScopeDTO extends ApiScopeBaseDTO {
  @ApiProperty({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Samnefni á umfangi',
      },
      {
        locale: 'en',
        value: 'Scope alias name',
      },
    ],
  })
  displayName!: TranslatedValueDto[]

  @ApiProperty({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Lýsing á umfangi',
      },
      {
        locale: 'en',
        value: 'Scope description',
      },
    ],
  })
  description!: TranslatedValueDto[]

  @ApiProperty({ type: String, example: '@island.is' })
  domainName!: string

  @ApiPropertyOptional({
    type: [String],
    example: ['4vQ4htPOAZvzcXBcjx06SH'],
    description: 'CMS category IDs associated with this scope',
  })
  categoryIds?: string[]

  @ApiPropertyOptional({
    type: [String],
    example: ['2eGxK9pLm3'],
    description: 'CMS tag IDs associated with this scope',
  })
  tagIds?: string[]
}
