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

import {
  CaseFileCategory,
  CaseFileState,
} from '@island.is/judicial-system/types'

// TODO Find a way to import from an index file
import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'case_file',
  timestamps: true,
})
export class CaseFile extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  caseId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseFileCategory),
  })
  @ApiPropertyOptional({ enum: CaseFileCategory })
  category?: CaseFileCategory

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseFileState),
  })
  @ApiProperty({ enum: CaseFileState })
  state!: CaseFileState

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  key?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  size!: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  policeCaseNumber?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  userGeneratedFilename?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  chapter?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional()
  orderWithinChapter?: number

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  displayDate?: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  policeFileId?: string
}
