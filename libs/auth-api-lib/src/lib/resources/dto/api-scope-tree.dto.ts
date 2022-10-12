import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'

import { ApiScopeGroup } from '../models/api-scope-group.model'
import { ApiScope } from '../models/api-scope.model'

export class ApiScopeTreeDTO {
  @ApiProperty({
    description: 'Name of the api scope or api scope group.',
    example: 'finances',
  })
  name!: string

  @ApiProperty({
    description: 'Display name of the api scope or api scope group.',
    example: 'Fjármál',
  })
  displayName!: string

  @ApiProperty({
    description: 'Description of the api scope or api scope group.',
    example: 'Aðgangur að fjármálum.',
  })
  description!: string

  @ApiProperty({
    description: 'Domain name which the scope or group belongs to.',
    example: '@island.is',
  })
  domainName!: string

  @ApiHideProperty()
  order!: number

  @ApiProperty({
    description:
      'List of scopes belonging to the group. When children are empty it represents a scope.',
    isArray: true,
    type: ApiScopeTreeDTO,
    example: [
      {
        name: '@island.is/finances/schedule',
        displayName: 'Greiðsluáætlun',
        description: 'Aðgangur að greiðsluáætlunum.',
        domainName: '@island.is',
        children: [],
      },
      {
        name: '@island.is/finances/overview',
        displayName: 'Yfirlit',
        description: 'Aðgangur að fjármála yfirliti.',
        domainName: '@island.is',
        children: [],
      },
    ],
  })
  children!: ApiScopeTreeDTO[]

  static fromModel(model: ApiScope | ApiScopeGroup) {
    return {
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      domainName: '', //model.domainName,
      order: model.order,
      children: [],
    }
  }
}
