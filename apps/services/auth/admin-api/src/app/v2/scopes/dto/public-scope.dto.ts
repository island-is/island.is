import { ApiProperty } from '@nestjs/swagger'

import { TranslatedValueDto } from '@island.is/auth-api-lib'

export class PublicScopeDto {
  @ApiProperty({ example: '@island.is/scope' })
  name!: string

  @ApiProperty({ type: [TranslatedValueDto] })
  displayName!: TranslatedValueDto[]

  @ApiProperty({ type: [TranslatedValueDto] })
  description!: TranslatedValueDto[]
}
