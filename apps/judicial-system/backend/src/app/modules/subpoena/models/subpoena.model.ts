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

import { HashAlgorithm, ServiceStatus } from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'
import { Defendant } from '../../defendant/models/defendant.model'

@Table({
  tableName: 'subpoena',
  timestamps: true,
})
export class Subpoena extends Model {
  static serviceStatusText(serviceStatus: ServiceStatus) {
    return serviceStatus === ServiceStatus.DEFENDER
      ? 'Birt fyrir verjanda'
      : serviceStatus === ServiceStatus.ELECTRONICALLY
      ? 'Birt rafrænt'
      : serviceStatus === ServiceStatus.IN_PERSON
      ? 'Birt persónulega'
      : serviceStatus === ServiceStatus.FAILED
      ? 'Árangurslaus birting'
      : serviceStatus === ServiceStatus.EXPIRED
      ? 'Rann út á tíma'
      : 'Í birtingarferli' // This should never happen
  }

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

  @ApiPropertyOptional({ type: String })
  @Column({ type: DataType.STRING, allowNull: true })
  policeSubpoenaId?: string

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false })
  defendantId!: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiProperty({ type: () => Defendant })
  defendant?: Defendant

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceStatus),
  })
  @ApiPropertyOptional({ enum: ServiceStatus })
  serviceStatus?: ServiceStatus

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  serviceDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  servedBy?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  comment?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defenderNationalId?: string

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty({ type: Date })
  arraignmentDate!: Date

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  location!: string

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
}
