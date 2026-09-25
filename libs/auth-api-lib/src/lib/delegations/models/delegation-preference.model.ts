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
 * What an actor has chosen about the parties they can act for: which ones they
 * starred, and when they last switched to them. Both feed the "Veldu notanda"
 * screen, which lists favourites and recently used above the full list.
 *
 * Keyed on the two national ids alone rather than on a delegation row, because
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
    {
      fields: ['to_national_id'],
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

  /** The actor who holds the delegation. */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  toNationalId!: string

  /** The party being represented. */
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
