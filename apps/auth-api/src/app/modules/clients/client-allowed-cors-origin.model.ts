import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Client } from './client.model'

@Table({
  tableName: 'client_allowed_cors_origin',
  indexes: [
    {
      fields: ['client_id'],
    },
  ],
})
export class ClientAllowedCorsOrigin extends Model<ClientAllowedCorsOrigin> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  origin: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId: string
}
