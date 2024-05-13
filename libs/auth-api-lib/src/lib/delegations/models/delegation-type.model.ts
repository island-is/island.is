import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript'

import { DelegationProviderModel } from './delegation-provider.model'
import { ClientDelegationType } from '../../clients/models/client-delegation-type.model'
import { Client } from '../../clients/models/client.model'

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
    field: 'provider',
  })
  @ForeignKey(() => DelegationProviderModel)
  providerId!: string

  @BelongsTo(() => DelegationProviderModel)
  provider!: CreationOptional<DelegationProviderModel>

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

  @BelongsToMany(() => Client, () => ClientDelegationType)
  clients!: Client[]

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
