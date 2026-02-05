import { ApiProperty } from '@nestjs/swagger'
import { ScopeDTO } from './scope.dto'

export class ScopeCategoryDTO {
  @ApiProperty({
    description: 'Unique ID of the category from CMS',
    example: '7a8d2f3e4b5c6d7e8f9a0b1c',
  })
  id!: string

  @ApiProperty({
    description: 'Category title',
    example: 'Fjármál',
  })
  title!: string

  @ApiProperty({
    description: 'Category description',
    example: 'Upplýsingar um fjármál og greiðslur',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'fjarmal',
  })
  slug!: string

  @ApiProperty({
    description: 'List of scopes in this category',
    type: [ScopeDTO],
  })
  scopes!: ScopeDTO[]
}

export class ScopeTagDTO {
  @ApiProperty({
    description: 'Unique ID of the tag (life event) from CMS',
    example: '7a8d2f3e4b5c6d7e8f9a0b1c',
  })
  id!: string

  @ApiProperty({
    description: 'Tag title',
    example: 'Eignir og skuldir',
  })
  title!: string

  @ApiProperty({
    description: 'Tag intro/description',
    example: 'Þegar þú ert að kaupa eða selja eignir',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'List of scopes tagged with this life event',
    type: [ScopeDTO],
  })
  scopes!: ScopeDTO[]
}
