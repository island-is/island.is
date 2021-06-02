import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { DelegationScope } from './delegation-scope.model'

@Table({
  tableName: 'delegation',
  timestamps: false,
})
export class Delegation extends Model<Delegation> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromDisplayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]
}
