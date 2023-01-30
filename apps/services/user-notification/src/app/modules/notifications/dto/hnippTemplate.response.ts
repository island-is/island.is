import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class HnippTemplate {
  @ApiProperty()
  templateId!: string
  @ApiProperty()
  notificationTitle!: string
  @ApiProperty()
  notificationBody!: string
  @ApiProperty()
  notificationDataCopy?: string
  @ApiProperty()
  clickAction?: string
  @ApiProperty()
  category?: string
  @ApiProperty()
  args?: string[]
}
