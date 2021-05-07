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

@Table({
  tableName: 'delegation_scope',
  indexes: [
    {
      fields: ['delegation_id, scope_name'],
    },
  ],
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

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
