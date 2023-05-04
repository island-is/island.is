import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'

export class Course {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for id',
    example: 'Example value for id',
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for name',
    example: 'Example value for name',
  })
  name!: string

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for credits',
    example: 'Example value for credits',
  })
  credits!: number

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for majorId',
    example: 'Example value for majorId',
  })
  majorId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for majorName',
    example: 'Example value for majorName',
  })
  majorName!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for universityId',
    example: 'Example value for universityId',
  })
  universityId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for universityName',
    example: 'Example value for universityName',
  })
  universityName!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'TBD',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  tbd?: string
}
