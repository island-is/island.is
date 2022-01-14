import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  HasOne,
} from 'sequelize-typescript'

import {
  RegulationType,
  ISODate,
  RegName,
  MinistrySlug,
  LawChapterSlug,
  Kennitala,
  URLString,
  HTMLText,
  PlainText,
} from '@island.is/regulations'
import { DraftingStatus, RegulationDraftId } from '@island.is/regulations/admin'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DraftRegulationChangeModel } from '../draft_regulation_change'
import { DraftRegulationCancelModel } from '../draft_regulation_cancel'

@Table({
  tableName: 'draft_regulation',
})
export class DraftRegulationModel extends Model<DraftRegulationModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: RegulationDraftId

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['draft', 'proposal', 'shipped', 'published'],
  })
  @ApiProperty()
  drafting_status!: DraftingStatus

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  @ApiProperty()
  name?: RegName

  @Column({
    type: DataType.STRING,
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
  ministry_id?: MinistrySlug

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  signature_date?: ISODate

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

  @HasMany(() => DraftRegulationChangeModel)
  @ApiPropertyOptional({ type: [DraftRegulationChangeModel] })
  changes?: DraftRegulationChangeModel[]

  @HasOne(() => DraftRegulationCancelModel)
  @ApiPropertyOptional({ type: DraftRegulationCancelModel })
  cancel?: DraftRegulationCancelModel
}
