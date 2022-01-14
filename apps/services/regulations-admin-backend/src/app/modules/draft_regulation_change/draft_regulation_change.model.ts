import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DraftRegulationModel } from '../draft_regulation'

import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { RegulationDraftId } from '@island.is/regulations/admin'

@Table({
  tableName: 'draft_regulation_change',
})
export class DraftRegulationChangeModel extends Model<DraftRegulationChangeModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => DraftRegulationModel)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  changing_id!: RegulationDraftId

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  regulation!: RegName

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  date!: ISODate

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  title!: PlainText

  @Column({
    type: DataType.TEXT,
  })
  @ApiProperty()
  text!: HTMLText
}
