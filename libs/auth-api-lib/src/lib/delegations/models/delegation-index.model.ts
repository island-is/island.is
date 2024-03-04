import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'delegation_index',
  timestamps: true,
})
export class DelegationIndex extends Model<
  InferAttributes<DelegationIndex>,
  InferCreationAttributes<DelegationIndex>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  provider!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  type!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: CreationOptional<Date> | null

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
