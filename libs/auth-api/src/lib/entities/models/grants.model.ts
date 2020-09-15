import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
const { v4: uuidv4 } = require('uuid')

@Table({
  tableName: 'grants',
  indexes: [
    {
      fields: ['id'],
    },
  ],
})
export class Grant extends Model<Grant> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({
    example: uuidv4(),
  })
  id: string

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
    example: 'postman',
  })
  clientId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'data',
  })
  data: string

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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'subject_id',
  })
  subject_id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'type',
  })
  type: string
}
