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

import { CommentType } from '@island.is/judicial-system/types'

import { Case } from './case.model'

@Table({
  tableName: 'explanatory_comment',
  timestamps: false,
})
export class ExplanatoryComment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @Column({ type: DataType.DATE })
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({ type: DataType.STRING })
  @ApiProperty()
  commentType!: CommentType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID })
  @ApiPropertyOptional()
  caseId!: string

  @Column({ type: DataType.STRING })
  @ApiPropertyOptional()
  comment!: string
}
