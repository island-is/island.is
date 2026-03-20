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

import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationRecordDTO } from '../dto/delegation-index.dto'

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

  toDTO(): DelegationRecordDTO {
    return {
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      subjectId: this.subjectId,
      type: this.type as AuthDelegationType,
      customDelegationScopes: this.customDelegationScopes,
    }
  }
}
