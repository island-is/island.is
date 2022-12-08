import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  BelongsTo,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Delegation } from './delegation.model'
import { DelegationScopeDTO } from '../dto/delegation-scope.dto'
import { ApiScope } from '../../resources/models/api-scope.model'

@Table({
  tableName: 'delegation_scope',
  timestamps: false,
})
export class DelegationScope extends Model<
  InferAttributes<DelegationScope>,
  InferCreationAttributes<DelegationScope>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ForeignKey(() => Delegation)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  delegationId!: string

  @BelongsTo(() => Delegation)
  delegation?: Delegation

  @ForeignKey(() => ApiScope)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  scopeName!: string

  @BelongsTo(() => ApiScope)
  apiScope?: ApiScope

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  validFrom!: CreationOptional<Date>

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: Date

  @CreatedAt
  @ApiProperty({ type: Date })
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  toDTO(): DelegationScopeDTO {
    return {
      id: this.id,
      delegationId: this.delegationId,
      scopeName: this.scopeName,
      displayName: this.apiScope?.displayName ?? 'N/A',
      validFrom: this.validFrom,
      validTo: this.validTo,
    }
  }
}
