import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

@Table({
  tableName: 'message_suspension',
  timestamps: true,
})
export class MessageSuspension extends Model {
  // One row per suspension category. The category is the natural primary key
  // since the set is fixed and seeded by migration.
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({ enum: MessageSuspensionCategory })
  category!: MessageSuspensionCategory

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  @ApiProperty({ type: Boolean })
  suspended!: boolean

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 600 })
  @ApiProperty({ type: Number })
  delaySeconds!: number

  // National id of the user who last toggled this category. Stored without a
  // foreign key because the super admin role is not persisted in the user table.
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  modifiedBy?: string
}
