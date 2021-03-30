import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'IcelandicNames',
  timestamps: true,
})
export class IcelandicName extends Model<IcelandicName> {
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
    unique: true,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  status!: string | null

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description?: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  verdictDate?: Date | null

  @Column({
    type: DataType.NUMBER,
    defaultValue: 1,
  })
  @ApiProperty()
  visible?: number

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified?: Date
}

export default IcelandicName
