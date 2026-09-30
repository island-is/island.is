import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

/**
 * Keyed on the two national ids rather than on a delegation row, because
 * procuration and legal guardianship are served from RSK and the national
 * registry and never exist in the delegation table.
 */
@Table({
  tableName: 'delegation_preference',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'modified',
  indexes: [
    {
      fields: ['to_national_id', 'from_national_id'],
      unique: true,
    },
  ],
})
export class DelegationPreference extends Model<
  InferAttributes<DelegationPreference>,
  InferCreationAttributes<DelegationPreference>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: CreationOptional<string>

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  fromNationalId!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isFavourite!: CreationOptional<boolean>

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty({ type: Date, nullable: true })
  lastUsedAt?: Date | null

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
