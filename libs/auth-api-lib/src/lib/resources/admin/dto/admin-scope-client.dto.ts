import { ApiProperty } from '@nestjs/swagger'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'

export class AdminScopeClientDto {
  @ApiProperty({
    description: 'The client identifier',
    example: '@island.is/web',
  })
  clientId!: string

  @ApiProperty({
    description: 'The type of the client',
    example: 'web',
  })
  clientType!: string

  @ApiProperty({
    type: [TranslatedValueDto],
    description: 'Translated display name of the client',
    example: [
      { locale: 'is', value: 'Mínar síður' },
      { locale: 'en', value: 'My pages' },
    ],
  })
  displayName!: TranslatedValueDto[]
}
