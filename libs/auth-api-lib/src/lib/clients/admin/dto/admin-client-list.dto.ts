import { ApiProperty } from '@nestjs/swagger'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { ClientType } from '../../../types'

export class AdminClientListDto {
  @ApiProperty()
  clientId!: string

  @ApiProperty({
    description: 'Id of the tenant the client belongs to.',
    example: '@island.is',
  })
  tenantId!: string

  @ApiProperty({
    example: 'web',
    enum: ClientType,
    enumName: 'ClientType',
  })
  clientType!: string

  @ApiProperty({
    type: [TranslatedValueDto],
  })
  displayName!: TranslatedValueDto[]
}
