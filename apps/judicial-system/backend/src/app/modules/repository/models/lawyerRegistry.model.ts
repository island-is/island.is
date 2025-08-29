import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@Table({
  tableName: 'lawyer_registry',
  timestamps: true,
})
export class LawyerRegistry extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  name?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  email?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  phoneNumber?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  practice?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isLitigator?: boolean
}
