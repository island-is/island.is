import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'

export class PageInfo {
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for has previous page',
    example: true,
  })
  hasPreviousPage!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for has next page',
    example: true,
  })
  hasNextPage!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for start cursor',
    example: 'aWQ6MTAwMQ==',
  })
  @ApiPropertyOptional()
  startCursor?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'Column description for end cursor',
    example: 'aWQ6MTAwMw==',
  })
  endCursor?: string
}
