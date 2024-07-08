import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

import {
  RegulationType,
  ISODate,
  RegName,
  LawChapterSlug,
  Kennitala,
  URLString,
  HTMLText,
  PlainText,
  Appendix,
} from '@island.is/regulations'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DraftRegulationChangeModel } from '../draft_regulation_change'
import { DraftRegulationCancelModel } from '../draft_regulation_cancel'

@Table({
  tableName: 'draft_regulation',
})
export class DraftRegulationModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['draft', 'proposal', 'shipped', 'published'],
  })
  @ApiProperty()
  drafting_status!: string

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  @ApiProperty()
  name?: RegName

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  title!: PlainText

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  text!: HTMLText

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  @ApiProperty()
  appendixes?: Appendix[]

  @Column({
    type: DataType.TEXT,
  })
  @ApiProperty()
  comments?: HTMLText

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  drafting_notes!: HTMLText

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  ideal_publish_date?: ISODate

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  ministry?: string

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  signature_date?: ISODate

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  signature_text?: HTMLText

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  effective_date?: ISODate

  @Column({
    type: DataType.ENUM,
    values: ['base', 'amending'],
  })
  @ApiProperty()
  type?: RegulationType

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  authors!: Kennitala[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  law_chapters?: LawChapterSlug[]

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  signed_document_url?: URLString

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  fast_track?: boolean

  @HasMany(() => DraftRegulationChangeModel)
  @ApiPropertyOptional({ type: [DraftRegulationChangeModel] })
  changes?: DraftRegulationChangeModel[]

  @HasMany(() => DraftRegulationCancelModel)
  @ApiPropertyOptional({ type: [DraftRegulationCancelModel] })
  cancels?: DraftRegulationCancelModel[]
}
