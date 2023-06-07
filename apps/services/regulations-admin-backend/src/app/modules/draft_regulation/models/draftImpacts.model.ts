import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger'
import { Appendix, HTMLText, ISODate, PlainText } from '@island.is/regulations'

export class DraftRegulationCancelImpact {
  @ApiProperty()
  readonly type!: string

  @ApiProperty()
  readonly name!: string

  @ApiProperty()
  readonly regTitle!: PlainText

  @ApiProperty()
  readonly id!: string

  @ApiPropertyOptional()
  readonly changingId?: string

  @ApiPropertyOptional()
  readonly date?: ISODate

  @ApiPropertyOptional()
  readonly dropped?: boolean
}

export class DraftRegulationChangeImpact {
  @ApiProperty()
  readonly type!: string

  @ApiProperty()
  readonly name!: string

  @ApiProperty()
  readonly regTitle!: PlainText

  @ApiProperty()
  readonly id!: string

  @ApiPropertyOptional()
  readonly changingId?: string

  @ApiPropertyOptional()
  readonly date?: ISODate

  @ApiPropertyOptional()
  readonly dropped?: boolean

  @ApiPropertyOptional()
  readonly title?: PlainText

  @ApiPropertyOptional()
  readonly diff?: HTMLText

  @ApiPropertyOptional()
  readonly text?: HTMLText

  @ApiPropertyOptional()
  readonly appendixes?: Array<Appendix>

  @ApiPropertyOptional()
  readonly comments?: HTMLText
}

export class DraftImpactModel extends IntersectionType(
  DraftRegulationCancelImpact,
  DraftRegulationChangeImpact,
) {}
