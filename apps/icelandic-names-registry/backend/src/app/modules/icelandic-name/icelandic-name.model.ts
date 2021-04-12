import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import {
  IcelandicName as TIcelandicName,
  NameType,
  StatusType,
} from '@island.is/icelandic-names-registry-types'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'icelandic_names',
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
  icelandicName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: NameType

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  status!: StatusType

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verdict!: string | null

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  visible!: boolean | null

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url!: string | null

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}

export default IcelandicName
