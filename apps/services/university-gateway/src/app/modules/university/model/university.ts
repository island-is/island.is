import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'

export class University {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'University national ID',
    example: '123456-7890',
  })
  nationalId!: string
}

export class UniversityResponse {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({
    description: 'University data',
    type: University,
    isArray: true,
  })
  data!: University[]
}
