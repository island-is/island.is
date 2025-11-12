import { ApiProperty } from '@nestjs/swagger'

export class HnippTemplate {
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

  @ApiProperty({ example: 'New document' })
  title!: string

  @ApiProperty({ example: 'New document from {{organization}}' })
  externalBody!: string

  @ApiProperty({ example: 'Some extra text ...' })
  internalBody?: string

  @ApiProperty({ example: 'https://island.is/minarsidur/postholf' })
  clickActionUrl!: string

  @ApiProperty({ example: ['arg1', 'arg2'] })
  args!: string[]

  @ApiProperty({
    example: '@island.is/documents',
  })
  scope!: string
}

/**
 * Raw template structure returned from Contentful when using locale: '*'
 * Localized fields are returned as Record<string, string> keyed by locale codes (e.g., 'is-IS', 'en')
 * Non-localized fields remain as simple types
 */
export type RawHnippTemplate = {
  templateId: string
  title: string | Record<string, string>
  externalBody: string | Record<string, string>
  internalBody?: string | Record<string, string>
  clickActionUrl: string | Record<string, string>
  args: string[]
  scope: string
}
