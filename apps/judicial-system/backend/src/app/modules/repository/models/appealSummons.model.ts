import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { HashAlgorithm } from '@island.is/judicial-system/types'

import { AppealCase } from './appealCase.model'
import { AppealSummonsDefendant } from './appealSummonsDefendant.model'
import { Case } from './case.model'
import { User } from './user.model'

@Table({
  tableName: 'appeal_summons',
  timestamps: true,
})
export class AppealSummons extends Model {
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

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @ForeignKey(() => AppealCase)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealCaseId!: string

  @BelongsTo(() => AppealCase, 'appealCaseId')
  @ApiPropertyOptional({ type: () => AppealCase })
  appealCase?: AppealCase

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  confirmedById?: string

  @BelongsTo(() => User, 'confirmedById')
  @ApiPropertyOptional({ type: () => User })
  confirmedBy?: User

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  confirmedDate?: Date

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  sentToCourtOfAppealsDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  hash?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(HashAlgorithm),
  })
  @ApiPropertyOptional({ enum: HashAlgorithm })
  hashAlgorithm?: HashAlgorithm

  @HasMany(() => AppealSummonsDefendant, 'appealSummonsId')
  @ApiPropertyOptional({ type: () => AppealSummonsDefendant, isArray: true })
  defendants?: AppealSummonsDefendant[]
}
