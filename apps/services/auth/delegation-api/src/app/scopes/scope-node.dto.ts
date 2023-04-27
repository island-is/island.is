import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ScopeGroupDTO } from './scope-group.dto'
import { ScopeDTO } from './scope.dto'

export class ScopeNodeDTO {
  constructor(model: ScopeDTO | ScopeGroupDTO) {
    this.name = model.name
    this.displayName = model.displayName
    this.description = model.description
    this.domainName = model.domainName

    if (model instanceof ScopeGroupDTO) {
      this.children = []
    }
  }

  @ApiProperty({
    description: 'Name of the scope node.',
    example: '@island.is/finances',
  })
  name: string

  @ApiProperty({
    description: 'Display name of the scope node.',
    example: 'Fjármál',
  })
  displayName: string

  @ApiProperty({
    description: 'Description of the scope node.',
    example: 'Aðgangur að fjármálum.',
  })
  description?: string

  @ApiProperty({
    description: 'Domain name which the scope node belongs to.',
    example: '@island.is',
  })
  domainName: string

  @ApiPropertyOptional({
    description:
      'List of scopes belonging to the node. When children is undefined it represents a scope instead of a group.',
    isArray: true,
    type: ScopeNodeDTO,
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
  children?: ScopeNodeDTO[]
}
