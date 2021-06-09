import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Delegation } from './delegation.model'
import { DelegationScopeDTO } from '../dto/delegation-scope.dto'

@Table({
  tableName: 'delegation_scope',
  timestamps: false,
})
export class DelegationScope extends Model<DelegationScope> {
  @PrimaryKey
  @ForeignKey(() => Delegation)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  delegationId!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  scopeName!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validFrom!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validTo?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  toDTO(): DelegationScopeDTO {
    return {
      delegationId: this.delegationId,
      scopeName: this.scopeName,
      validFrom: this.validFrom,
      validTo: this.validTo,
    }
  }
}
