import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'tag',
})
export class ProgramTag extends Model {
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
    description: 'Contentful key for tag',
    example: 'engineer',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentfulKey!: string
}
