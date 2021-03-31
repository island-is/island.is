import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { IcelandicName as TIcelandicName } from '../../../../types'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'icelandic_names',
  timestamps: true,
})
export class IcelandicName
  extends Model<IcelandicName>
  implements TIcelandicName {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  @ApiProperty()
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  icelandic_name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  status!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verdict!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  visible!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url!: string

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}

export default IcelandicName
