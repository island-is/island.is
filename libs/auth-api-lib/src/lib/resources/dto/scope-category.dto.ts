import { ApiProperty } from '@nestjs/swagger'

export class SimpleScopeDTO {
  @ApiProperty({
    description: 'The unique name/identifier of the scope',
    example: '@island.is/finance:overview',
  })
  name!: string

  @ApiProperty({
    description: 'Display name of the scope',
    example: 'Fjármálayfirlit',
  })
  displayName!: string

  @ApiProperty({
    description: 'Description of what the scope allows',
    example: 'Sækja yfirlit yfir fjármál',
  })
  description!: string
}

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
    type: [SimpleScopeDTO],
  })
  scopes!: SimpleScopeDTO[]
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
  intro?: string

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'eignir-og-skuldir',
  })
  slug!: string

  @ApiProperty({
    description: 'List of scopes tagged with this life event',
    type: [SimpleScopeDTO],
  })
  scopes!: SimpleScopeDTO[]
}
