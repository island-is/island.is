import { ApiProperty } from '@nestjs/swagger'

export class HnippTemplate {
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

  @ApiProperty({ example: 'New document' })
  notificationTitle!: string

  @ApiProperty({ example: 'New document from {{organization}}' })
  notificationBody!: string

  @ApiProperty({ example: 'Some extra text ...' })
  notificationDataCopy?: string

  /**
   * @deprecated Legacy support
   */
  @ApiProperty({ example: '//inbox/{{documentId}}' })
  clickAction?: string

  /**
   * @deprecated Will be removed
   */
  @ApiProperty({ example: 'https://island.is/minarsidur/postholf' })
  clickActionWeb?: string

  @ApiProperty({ example: 'https://island.is/minarsidur/postholf' })
  clickActionUrl?: string

  @ApiProperty({ example: 'NEW_DOCUMENT' })
  category?: string

  @ApiProperty({ example: ['arg1', 'arg2'] })
  args!: string[]
}
