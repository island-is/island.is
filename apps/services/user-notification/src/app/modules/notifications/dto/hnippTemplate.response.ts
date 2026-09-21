import { ApiProperty } from '@nestjs/swagger'

export type HnippTemplatePriorityType = 'Informative' | 'Actionable' | undefined

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

  @ApiProperty({
    example: 'Informative',
  })
  priorityType?: HnippTemplatePriorityType
}
