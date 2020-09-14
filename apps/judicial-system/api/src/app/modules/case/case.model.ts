import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum CaseState {
  UNKNOWN = 'UNKNOWN',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
} // TODO get from somewhere

@Table({
  tableName: 'case',
  timestamps: true,
})
export class Case extends Model<Case> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.DRAFT,
  })
  @ApiProperty({ enum: CaseState })
  state: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  suspectNationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  suspectName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  suspectAddress: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  court: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  arrestDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedCourtDate: Date
}
