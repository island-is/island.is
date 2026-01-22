import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { UserRole } from '@island.is/judicial-system/types'

import { Institution } from './institution.model'

@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  nationalId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  name!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  title!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  mobileNumber!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  email!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserRole).filter(
      (role) => ![UserRole.ADMIN, UserRole.DEFENDER].includes(role),
    ),
  })
  @ApiProperty({ enum: UserRole })
  role!: UserRole

  @ForeignKey(() => Institution)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  institutionId?: string

  @BelongsTo(() => Institution, 'institutionId')
  @ApiPropertyOptional({ type: () => Institution })
  institution?: Institution

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  @ApiProperty({ type: Boolean })
  active!: boolean

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  @ApiProperty({ type: Boolean })
  canConfirmIndictment!: boolean
}
