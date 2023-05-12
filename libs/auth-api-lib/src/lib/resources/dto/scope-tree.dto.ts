import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ApiScopeGroup } from '../models/api-scope-group.model'
import { ApiScope } from '../models/api-scope.model'
import { ScopeDTO } from './scope.dto'

export class ScopeTreeDTO {
  constructor(model: ApiScope | ApiScopeGroup | ScopeDTO) {
    this.name = model.name
    this.displayName = model.displayName
    this.description = model.description
    this.domainName = model.domainName

    if (model instanceof ApiScopeGroup) {
      this.children = []
    }
  }

  @ApiProperty({
    description: 'Name of the api scope or api scope group.',
    example: '@island.is/finances',
  })
  name: string

  @ApiProperty({
    description: 'Display name of the api scope or api scope group.',
    example: 'Fjármál',
  })
  displayName: string

  @ApiProperty({
    description: 'Description of the api scope or api scope group.',
    example: 'Aðgangur að fjármálum.',
  })
  description: string

  @ApiProperty({
    description: 'Domain name which the scope or group belongs to.',
    example: '@island.is',
  })
  domainName: string

  @ApiPropertyOptional({
    description:
      'List of scopes belonging to the group. When children is undefined it represents a scope instead of a group.',
    isArray: true,
    type: ScopeTreeDTO,
    example: [
      {
        name: '@island.is/finances/schedule',
        displayName: 'Greiðsluáætlun',
        description: 'Aðgangur að greiðsluáætlunum.',
        domainName: '@island.is',
      },
      {
        name: '@island.is/finances/overview',
        displayName: 'Yfirlit',
        description: 'Aðgangur að fjármála yfirliti.',
        domainName: '@island.is',
      },
    ],
  })
  children?: ScopeTreeDTO[]
}
