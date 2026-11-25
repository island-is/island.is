import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export const HNIPP_TEMPLATE_PRIORITY_TYPES = [
  'Informative',
  'Actionable',
  'Important',
] as const

export type HnippTemplatePriorityType =
  | typeof HNIPP_TEMPLATE_PRIORITY_TYPES[number]
  | undefined

export const HNIPP_TEMPLATE_SOURCE_TYPES = ['Mail', 'Event', 'General'] as const

export type HnippTemplateSourceType = typeof HNIPP_TEMPLATE_SOURCE_TYPES[number]

/** Source type of templates without one (or with an unknown one) in Contentful */
export const DEFAULT_HNIPP_TEMPLATE_SOURCE_TYPE: HnippTemplateSourceType =
  'General'

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

  @ApiProperty({
    example: 'Landlæknir',
  })
  smsPayer!: string

  @ApiProperty({
    example: 'OPT_IN',
  })
  smsDelivery!: string

  @ApiPropertyOptional({
    enum: HNIPP_TEMPLATE_PRIORITY_TYPES,
    example: 'Informative',
    description:
      'Whether the notification is informative, actionable or important. Recipients who only want actionable notifications do not receive push or email for other templates (including templates without a priority type) unless the notification is urgent. SMS with smsDelivery ALWAYS is still sent.',
  })
  priorityType?: HnippTemplatePriorityType

  @ApiProperty({
    enum: HNIPP_TEMPLATE_SOURCE_TYPES,
    example: 'General',
    description:
      'What kind of source the notification originates from. Defaults to General when the template has no (or an unknown) source type.',
  })
  sourceType!: HnippTemplateSourceType

  @ApiPropertyOptional({
    example: 'Heilbrigðismál',
  })
  hnippCategory?: string

  @ApiPropertyOptional({
    example: 'Heilbrigðismál',
    description:
      'The Icelandic HnippCategory regardless of locale, which the category key is slugified from',
  })
  hnippCategoryIs?: string
}
