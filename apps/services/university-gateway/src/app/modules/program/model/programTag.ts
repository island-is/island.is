import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
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
import { Program } from './program'
import { Tag } from './tag'

@Table({
  tableName: 'program_tag',
})
export class ProgramTag extends Model {
  // @ApiProperty({
  //   description: 'Program tag ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  // @ApiProperty({
  //   description: 'Program ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Program)
  programId!: string

  @ApiProperty({
    description: 'Tag ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Tag)
  tagId!: string

  @ApiProperty({
    description: 'Tag details',
    type: Tag,
  })
  @BelongsTo(() => Tag, 'tagId')
  details?: Tag

  // @ApiProperty({
  //   type: String,
  // })
  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  // @ApiProperty({
  //   type: String,
  // })
  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
