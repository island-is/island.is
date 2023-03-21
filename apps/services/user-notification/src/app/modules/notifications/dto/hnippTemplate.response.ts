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
  @ApiProperty({ example: '//inbox/{{documentId}}' })
  clickAction?: string
  @ApiProperty({ example: 'NEW_DOCUMENT' })
  category?: string
  @ApiProperty({ example: ['arg1', 'arg2'] })
  args!: string[]
}
