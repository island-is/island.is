import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'grants',
})
export class Grant extends Model<Grant> {

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'key',
  })
  key: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'type',
  })
  type: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'subjectId',
  })
  subjectId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'sessionId',
  })
  sessionId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'postman',
  })
  clientId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: 'description',
  })
  description: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  creationTime: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty({
    // add one day as an expiration example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)),
  })
  expiration: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  consumedTime: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'data',
  })
  data: string
}
