import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../defendant/models/defendant.model'
import { User } from '../user'
import { Case } from '../case'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class CaseListEntry extends Model {
  @ApiProperty()
  id!: string

  @ApiProperty()
  created!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate?: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumbers!: string[]

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.NEW,
  })
  @ApiProperty({ enum: CaseState })
  state!: CaseState

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseType),
  })
  type!: CaseType

  @HasMany(() => Defendant, 'caseId')
  @ApiProperty({ type: Defendant, isArray: true })
  defendants?: Defendant[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseNumber?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseDecision),
  })
  @ApiProperty({ enum: CaseDecision })
  decision?: CaseDecision

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  validToDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCourtDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  initialRulingDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  rulingDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtEndTime?: Date

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  prosecutorAppealDecision?: CaseAppealDecision

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  accusedAppealDecision?: CaseAppealDecision

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorPostponedAppealDate?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  accusedPostponedAppealDate?: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  judgeId?: string

  @BelongsTo(() => User, 'judgeId')
  @ApiProperty({ type: User })
  judge?: User

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorId?: string

  @BelongsTo(() => User, 'prosecutorId')
  @ApiProperty({ type: User })
  prosecutor?: User

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  registrarId?: string

  @BelongsTo(() => User, 'registrarId')
  @ApiProperty({ type: User })
  registrar?: User

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  creatingProsecutorId?: string

  @BelongsTo(() => User, 'creatingProsecutorId')
  @ApiProperty({ type: User })
  creatingProsecutor?: User

  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  parentCaseId?: string

  @BelongsTo(() => Case, 'parentCaseId')
  @ApiProperty({ type: Case })
  parentCase?: Case

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isArchived!: boolean
}
