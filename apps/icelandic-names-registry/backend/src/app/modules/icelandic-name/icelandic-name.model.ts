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
import { Optional } from 'sequelize/types'

interface IcelandicNameCreationAttributes
  extends Optional<TIcelandicName, 'id' | 'created' | 'modified'> {}

@Table({
  tableName: 'icelandic_names',
})
export class IcelandicName
  extends Model<TIcelandicName, IcelandicNameCreationAttributes>
  implements TIcelandicName
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  icelandicName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: NameType

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
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
