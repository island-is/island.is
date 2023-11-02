import { ApiProperty } from '@nestjs/swagger'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { ApiScopeBaseDTO } from '../../dto/base/api-scope-base.dto'

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
}
