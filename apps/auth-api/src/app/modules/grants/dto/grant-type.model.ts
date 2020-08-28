import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'grant_type',
  indexes: [
    {
      fields: ['id'],
    },
  ],
})
export class GrantType extends Model<GrantType> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description: string

}
