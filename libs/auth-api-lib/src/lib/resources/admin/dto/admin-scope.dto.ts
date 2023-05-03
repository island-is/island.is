import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ApiScope } from '../../models/api-scope.model'

export class AdminScopeDTO {
  constructor(apiScope: ApiScope) {
    this.name = apiScope.name
    this.displayName = apiScope.displayName
    this.description = apiScope.description
  }

  @IsString()
  @ApiProperty({ example: '@island.is' })
  name!: string

  @IsString()
  @ApiProperty({
    example: 'Ísland.is mínar síður',
  })
  displayName!: string

  @IsString()
  @ApiProperty({
    example: 'Description about the scope',
  })
  description!: string
}
