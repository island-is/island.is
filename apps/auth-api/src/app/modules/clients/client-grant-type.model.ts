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
  tableName: 'client_grant_type',
  indexes: [
    {
      fields: ['id', 'client_id', 'grant_type_id'],
    },
  ],
})
export class ClientGrantType extends Model<ClientGrantType> {
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
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    })
    // TODO: @ForeignKey(() => GrantType)
    @ApiProperty()
    grantTypeId: string
}
