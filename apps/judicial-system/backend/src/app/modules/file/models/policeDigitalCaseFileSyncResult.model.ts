import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceDigitalCaseFileSyncResult {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @ApiProperty({ type: String })
  policeDigitalFileId!: string

  @ApiProperty({ type: String })
  policeExternalVendorId!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiPropertyOptional({ type: Date })
  displayDate?: Date

  @ApiPropertyOptional({ type: Number })
  orderWithinChapter?: number

  @ApiProperty({ type: Boolean })
  isDeletable!: boolean

  @ApiProperty({ type: Boolean })
  isNew!: boolean
}
