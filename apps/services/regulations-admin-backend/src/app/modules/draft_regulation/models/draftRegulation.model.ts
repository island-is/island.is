import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Appendix,
  HTMLText,
  ISODate,
  LawChapter,
  PlainText,
  RegName,
  Regulation,
  RegulationType,
  URLString,
} from '@island.is/regulations'
import {
  DraftRegulationCancelImpact,
  DraftRegulationChangeImpact,
} from './draftImpacts.model'
import { AuthorModel } from './author.model'

export class DraftRegulationTemplate {
  @ApiProperty()
  readonly id!: string

  @ApiProperty()
  readonly draftingStatus!: string

  @ApiProperty()
  readonly title!: PlainText

  @ApiProperty()
  readonly text!: HTMLText

  @ApiProperty()
  readonly appendixes!: Array<Appendix>

  @ApiProperty()
  readonly comments!: HTMLText

  @ApiPropertyOptional()
  readonly name?: RegName

  @ApiProperty()
  readonly draftingNotes!: HTMLText

  @ApiProperty()
  readonly authors!: ReadonlyArray<AuthorModel>

  @ApiPropertyOptional()
  readonly lawChapters?: ReadonlyArray<LawChapter>

  @ApiPropertyOptional()
  readonly idealPublishDate?: ISODate

  @ApiPropertyOptional()
  readonly fastTrack?: boolean

  @ApiPropertyOptional()
  readonly effectiveDate?: ISODate

  @ApiPropertyOptional()
  readonly signatureDate?: ISODate

  @ApiProperty()
  readonly signatureText!: HTMLText

  @ApiPropertyOptional()
  readonly signedDocumentUrl?: URLString

  @ApiPropertyOptional()
  readonly type?: RegulationType

  @ApiPropertyOptional()
  readonly ministry?: string

  @ApiPropertyOptional()
  readonly impacts?: Record<
    string,
    Array<DraftRegulationCancelImpact | DraftRegulationChangeImpact>
  >
}
