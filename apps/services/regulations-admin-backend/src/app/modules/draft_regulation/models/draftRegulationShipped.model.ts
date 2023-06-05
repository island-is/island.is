import { ApiProperty } from '@nestjs/swagger'
import { ISODate, PlainText, RegName } from '@island.is/regulations'

export class DraftRegulationShippedModel {
  @ApiProperty()
  readonly id!: string

  @ApiProperty()
  readonly title!: PlainText

  @ApiProperty()
  readonly name!: RegName

  @ApiProperty()
  readonly idealPublishDate!: ISODate

  @ApiProperty()
  readonly draftingStatus!: string
}
