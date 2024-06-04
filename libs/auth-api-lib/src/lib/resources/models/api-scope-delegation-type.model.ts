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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ApiScope } from './api-scope.model'
import { DelegationTypeModel } from '../../delegations/models/delegation-type.model'

@Table({
  tableName: 'api_scope_delegation_types',
})
export class ApiScopeDelegationType extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => ApiScope)
  @ApiProperty()
  apiScopeName!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => DelegationTypeModel)
  @ApiProperty()
  delegationType!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiPropertyOptional()
  readonly modified?: Date
}
