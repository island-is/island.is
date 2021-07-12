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

import { DraftRegulation } from '../draft_regulation'

import { ISODate, RegName } from '@island.is/regulations'

@Table({
  tableName: 'draft_regulation_change',
})
export class DraftRegulationChange extends Model<DraftRegulationChange> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => DraftRegulation)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  changing_id!: string

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
  title!: string

  @Column({
    type: DataType.TEXT,
  })
  @ApiProperty()
  text!: string
}
