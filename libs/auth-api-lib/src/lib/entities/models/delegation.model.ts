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
  indexes: [
    {
      fields: ['id'],
    },
  ],
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

  @HasMany(() => DelegationScope)
  delegationScopes?: DelegationScope[]
}
