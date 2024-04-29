import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { DelegationProviderModel } from './delegation-provider.model'

@Table({
  tableName: 'delegation_type',
  timestamps: true,
})
export class DelegationTypeModel extends Model<
  InferAttributes<DelegationTypeModel>,
  InferCreationAttributes<DelegationTypeModel>
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
  @ForeignKey(() => DelegationProviderModel)
  provider!: string

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

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
