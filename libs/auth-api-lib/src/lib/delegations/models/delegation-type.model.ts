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
  BelongsToMany,
} from 'sequelize-typescript'

import { DelegationProviderModel } from './delegation-provider.model'
import { PersonalRepresentativeDelegationTypeModel } from '../../personal-representative/models/personal-representative-delegation-type.model'
import { DelegationTypeDto } from '../dto/delegation-type.dto'
import { ClientDelegationType } from '../../clients/models/client-delegation-type.model'
import { Client } from '../../clients/models/client.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { DelegationDelegationType } from './delegation-delegation-type.model'

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
  clients!: CreationOptional<Client[]>

  @BelongsToMany(() => ApiScope, () => ApiScopeDelegationType)
  apiScopes!: CreationOptional<ApiScope[]>

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => PersonalRepresentativeDelegationTypeModel)
  prDelegationType?: PersonalRepresentativeDelegationTypeModel[]

  @HasMany(() => DelegationDelegationType)
  delegationDelegationTypes?: DelegationDelegationType[]

  toDTO(): DelegationTypeDto {
    return {
      id: this.id,
      description: this.description,
      providerId: this.providerId,
      name: this.name,
    }
  }
}
