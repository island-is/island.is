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

import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'case_file',
  timestamps: true,
})
export class CaseFile extends Model<CaseFile> {
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
  key!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  size!: number
}
