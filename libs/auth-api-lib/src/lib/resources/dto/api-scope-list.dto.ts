import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ApiScopeGroup } from '../models/api-scope-group.model'
import { ApiScope } from '../models/api-scope.model'

export class ApiScopeListDTO {
  constructor(model: ApiScope | ApiScopeGroup) {
    this.name = model.name
    this.displayName = model.displayName
    this.description = model.description
    this.domainName = model.domainName
    this.group =
      model instanceof ApiScope && model.group
        ? new ApiScopeListDTO(model.group)
        : undefined
  }

  @ApiProperty({
    description: 'Name of the api scope or api scope group.',
    example: '@island.is/finances/schedule',
  })
  name: string

  @ApiProperty({
    description: 'Display name of the api scope or api scope group.',
    example: 'Greiðsluáætlun',
  })
  displayName: string

  @ApiProperty({
    description: 'Description of the api scope or api scope group.',
    example: 'Aðgangur að greiðsluáætlunum.',
  })
  description: string

  @ApiProperty({
    description: 'Domain name which the scope or group belongs to.',
    example: '@island.is',
  })
  domainName: string

  @ApiPropertyOptional({
    description:
      'The group this scope belongs to. This is undefined for groups and scopes which are not inside a group.',
    type: ApiScopeListDTO,
    example: [
      {
        name: '@island.is/finances',
        displayName: 'Fjármál',
        description: 'Aðgangur að fjármálum.',
        domainName: '@island.is',
      },
    ],
  })
  group?: ApiScopeListDTO
}
