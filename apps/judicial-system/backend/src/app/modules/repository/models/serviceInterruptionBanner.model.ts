import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// Singleton settings row (id = 1) for the yellow service-interruption banner.
@Table({
  tableName: 'service_interruption_banner',
  timestamps: true,
})
export class ServiceInterruptionBanner extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({ type: Number })
  id!: number

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Mikilvæg skilaboð',
  })
  @ApiProperty({ type: String })
  title!: string

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  @ApiProperty({ type: String })
  globalMessage!: string

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  @ApiProperty({ type: String })
  prosecutorMessage!: string

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  @ApiProperty({ type: String })
  courtMessage!: string

  // National id of the last editor. No FK — super admins are not in `user`.
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  modifiedBy?: string
}
