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
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

import { ApiScope } from '../../resources/models/api-scope.model'
import { DelegationRequestScopeDTO } from '../dto/delegation-request.dto'
import { DelegationRequest } from './delegation-request.model'

/**
 * A scope that a delegation request asks for. Mirrors {@link DelegationScope}
 * but hangs off a {@link DelegationRequest} instead of an actual delegation.
 */
@Table({
  tableName: 'delegation_request_scope',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
})
export class DelegationRequestScope extends Model<
  InferAttributes<DelegationRequestScope>,
  InferCreationAttributes<DelegationRequestScope>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ForeignKey(() => DelegationRequest)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  delegationRequestId!: string

  @BelongsTo(() => DelegationRequest)
  delegationRequest?: DelegationRequest

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
    allowNull: true,
  })
  validTo?: Date | null

  @CreatedAt
  @ApiProperty({ type: Date })
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  toDTO(): DelegationRequestScopeDTO {
    return {
      scopeName: this.scopeName,
      displayName: this.apiScope?.displayName ?? 'N/A',
      domainName: this.apiScope?.domainName ?? null,
      domainDisplayName: this.apiScope?.domain?.displayName ?? null,
      validTo: this.validTo,
    }
  }
}
