import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { InstitutionType } from '@island.is/judicial-system/types'

@Table({
  tableName: 'institution',
  timestamps: true,
})
export class Institution extends Model {
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(InstitutionType),
  })
  @ApiProperty({ enum: InstitutionType })
  type!: InstitutionType

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  @ApiProperty({ type: String })
  name!: string

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  @ApiProperty({ type: Boolean })
  active!: boolean

  @ForeignKey(() => Institution)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defaultCourtId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeCaseNumberPrefix?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  address?: string
}
