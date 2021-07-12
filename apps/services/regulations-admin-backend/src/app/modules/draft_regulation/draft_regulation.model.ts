import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
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
} from '@island.is/regulations'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DraftRegulationChange } from '../draft_regulation_change'
import { DraftRegulationCancel } from '../draft_regulation_cancel'

@Table({
  tableName: 'draft_regulation',
})
export class DraftRegulation extends Model<DraftRegulation> {
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
    values: ['draft', 'proposal', 'shipped'],
  })
  @ApiProperty()
  drafting_status!: 'draft' | 'proposal' | 'shipped'

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
  title?: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty()
  text?: string

  @Column({
    type: DataType.TEXT,
  })
  @ApiProperty()
  drafting_notes?: string

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
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  effective_date?: ISODate

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['base', 'amending'],
  })
  @ApiProperty()
  type?: RegulationType

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  authors!: Kennitala[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  law_chapters?: LawChapterSlug[]

  @HasMany(() => DraftRegulationChange)
  @ApiPropertyOptional({ type: [DraftRegulationChange] })
  changes?: DraftRegulationChange[]

  @HasOne(() => DraftRegulationCancel)
  @ApiPropertyOptional({ type: DraftRegulationCancel })
  cancel?: DraftRegulationCancel
}
