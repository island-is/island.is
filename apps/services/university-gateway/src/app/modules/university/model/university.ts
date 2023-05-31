import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'

export class University {
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
    description: 'Column description for national id',
    example: 'Example value for national id',
  })
  nationalId!: string
}

export class UniversityResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for data',
    type: University,
    isArray: true,
  })
  data!: University[]
}
