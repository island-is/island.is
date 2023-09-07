import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ProgramTag } from './programTag'

@Table({
  tableName: 'tag',
})
export class Tag extends Model {
  @ApiHideProperty()
  @ApiProperty({
    description: 'Tag ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiProperty({
    description: 'Tag code',
    example: 'ENGINEER',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string

  @ApiProperty({
    description: 'Tag name (Icelandic)',
    example: 'Verkfræði',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameIs!: string

  @ApiProperty({
    description: 'Tag name (English)',
    example: 'Engineer',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameEn!: string

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

export class TagResponse {
  @ApiProperty({
    description: 'Tag data',
    type: [Tag],
  })
  data!: Tag[]
}
