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

  // Contacts are looked up by institution and notification type, and one
  // address can serve several types - the public prosecution takes reopened
  // indictments and appealed verdicts at the same address - so the value is not
  // unique. The database has never constrained it either.
  @Column({ type: DataType.STRING, allowNull: false })
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
