import { ApiProperty } from '@nestjs/swagger'

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
}
