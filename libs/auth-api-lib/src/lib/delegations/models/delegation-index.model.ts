import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationRecordDTO } from '../dto/delegation-index.dto'
import { DelegationProviderModel } from './delegation-provider.model'
import { DelegationTypeModel } from './delegation-type.model'

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
  @ForeignKey(() => DelegationProviderModel)
  provider!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  @ForeignKey(() => DelegationTypeModel)
  type!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: CreationOptional<Date> | null

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  customDelegationScopes?: string[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subjectId?: string | null

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @BelongsTo(() => DelegationTypeModel)
  delegationType?: NonAttribute<DelegationTypeModel>

  toDTO(): DelegationRecordDTO {
    return {
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      subjectId: this.subjectId,
      type: this.type as AuthDelegationType,
      actorDiscretionRequired: this.delegationType?.actorDiscretionRequired,
    }
  }
}
