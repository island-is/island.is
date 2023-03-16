import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DraftRegulationModel } from '../draft_regulation'

import { ISODate, RegName } from '@island.is/regulations'

@Table({
  tableName: 'draft_regulation_cancel',
})
export class DraftRegulationCancelModel extends Model {
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
  changing_id!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  regulation!: RegName

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  dropped?: boolean

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  date!: ISODate
}
