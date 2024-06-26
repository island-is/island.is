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
import { DelegationProviderDto } from '../dto/delegation-provider.dto'

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order?: number

  @HasMany(() => DelegationTypeModel)
  delegationTypes!: CreationOptional<DelegationTypeModel[]>

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  toDTO(): DelegationProviderDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      delegationTypes: this.delegationTypes.map((type) => type.toDTO()),
    }
  }
}
