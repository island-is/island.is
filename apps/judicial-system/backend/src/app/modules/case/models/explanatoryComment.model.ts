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
  timestamps: true,
})
export class ExplanatoryComment extends Model {
  static postponedIndefinitelyExplanation(
    explanatoryComments?: ExplanatoryComment[],
  ) {
    return explanatoryComments?.find(
      (explanatoryComment) =>
        explanatoryComment.commentType ===
        CommentType.POSTPONED_INDEFINITELY_EXPLANATION,
    )
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CommentType),
  })
  @ApiProperty({ enum: CommentType })
  commentType!: CommentType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiPropertyOptional({ type: String })
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiPropertyOptional({ type: String })
  comment!: string
}
