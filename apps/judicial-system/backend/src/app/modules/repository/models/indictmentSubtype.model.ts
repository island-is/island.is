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
  tableName: 'indictment_subtype',
  timestamps: true,
})
export class IndictmentSubtype extends Model {
  @ApiProperty({ type: String })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ApiProperty({ type: Date })
  @CreatedAt
  created!: Date

  @ApiProperty({ type: Date })
  @UpdatedAt
  modified!: Date

  @ApiProperty({ type: String })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  article!: string

  @ApiPropertyOptional({ type: String })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mainCategory?: string

  @ApiPropertyOptional({ type: String })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subCategory?: string

  @ApiPropertyOptional({ type: String })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @ApiPropertyOptional({ type: String })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  details?: string

  @ApiProperty({ type: Boolean })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean

  @ApiPropertyOptional({ type: String })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  offenseType?: string
}
