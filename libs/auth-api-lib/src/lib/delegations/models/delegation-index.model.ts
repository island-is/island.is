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

class CreateOptional<T> {}

@Table({
  tableName: 'delegation_index',
  timestamps: false,
})
export class DelegationIndex extends Model<
  InferAttributes<DelegationIndex>,
  InferCreationAttributes<DelegationIndex>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  provider!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  customDelegationScopes?: CreateOptional<string[]>

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: CreateOptional<Date>

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
