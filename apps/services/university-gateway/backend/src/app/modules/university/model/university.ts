import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'university',
})
export class University extends Model {
  @ApiProperty({
    description: 'University ID',
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
    description: 'University national ID',
    example: '123456-7890',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @ApiProperty({
    description: 'Contentful key for university',
    example: 'UniversityOfIceland',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentfulKey!: string

  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}

export class UniversityResponse {
  @ApiProperty({
    description: 'University data',
    type: [University],
  })
  data!: University[]
}
