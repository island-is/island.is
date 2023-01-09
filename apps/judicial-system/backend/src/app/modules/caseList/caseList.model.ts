import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'

import {
  CaseListEntry as TCaseListEntry,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../defendant/models/defendant.model'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class CaseListEntry extends Model implements TCaseListEntry {
  @ApiProperty()
  id!: string

  /**********
   * The date and time the case was created in the Database
   **********/
  @ApiProperty()
  created!: Date

  /**********
   * The scheduled date and time of the case's court session
   **********/
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate?: string

  /**********
   * A case number in LÖKE (police information system) connected to the case
   **********/
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumbers!: string[]

  /**********
   * The case state - example: DRAFT
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.NEW,
  })
  @ApiProperty({ enum: CaseState })
  state!: CaseState

  /**********
   * The case type - example: CUSTODY
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseType),
  })
  type!: CaseType

  /**********
   * The case's defendants
   **********/
  @HasMany(() => Defendant, 'caseId')
  @ApiProperty({ type: Defendant, isArray: true })
  defendants?: Defendant[]

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isArchived!: boolean
}
