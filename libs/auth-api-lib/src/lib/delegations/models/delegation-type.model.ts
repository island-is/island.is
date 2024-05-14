import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { DelegationProviderModel } from './delegation-provider.model'
import { PersonalRepresentativeDelegationTypeModel } from '../../personal-representative/models/personal-representative-delegation-type.model'
import { DelegationTypeDto } from '../dto/delegation-type.dto'

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

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => PersonalRepresentativeDelegationTypeModel)
  prDelegationType?: PersonalRepresentativeDelegationTypeModel[]

  toDTO(): DelegationTypeDto {
    return {
      id: this.id,
      description: this.description,
      providerId: this.providerId,
      name: this.name,
    }
  }
}
