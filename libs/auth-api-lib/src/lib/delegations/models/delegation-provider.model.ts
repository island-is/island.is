import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { DelegationTypeModel } from './delegation-type.model'

@Table({
  tableName: 'delegation_provider',
  timestamps: true,
})
export class DelegationProviderModel extends Model<
  InferAttributes<DelegationProviderModel>,
  InferCreationAttributes<DelegationProviderModel>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string

  @HasMany(() => DelegationTypeModel)
  delegationTypes!: DelegationTypeModel[]

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
