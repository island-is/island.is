import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export const HNIPP_TEMPLATE_PRIORITY_TYPES = [
  'Informative',
  'Actionable',
] as const

export type HnippTemplatePriorityType =
  | typeof HNIPP_TEMPLATE_PRIORITY_TYPES[number]
  | undefined

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
      "Whether the notification is informative or actionable. Recipients who only want actionable notifications do not receive push or email for other templates (including templates without a priority type) unless the notification is urgent. SMS with smsDelivery ALWAYS is still sent. For delegations, the delegate's own setting applies.",
  })
  priorityType?: HnippTemplatePriorityType
}
