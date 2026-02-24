import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  DefendantNotificationType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { Institution } from './institution.model'

@Table({
  tableName: 'institution_contact',
  timestamps: true,
})
export class InstitutionContact extends Model {
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

  @ForeignKey(() => Institution)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  institutionId!: string

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  @ApiProperty({ type: String })
  value!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: [
      ...Object.values(IndictmentCaseNotificationType),
      ...Object.values(DefendantNotificationType),
    ],
  })
  @ApiProperty({
    enum: [
      ...Object.values(IndictmentCaseNotificationType),
      ...Object.values(DefendantNotificationType),
    ],
  })
  type!: IndictmentCaseNotificationType | DefendantNotificationType
}
