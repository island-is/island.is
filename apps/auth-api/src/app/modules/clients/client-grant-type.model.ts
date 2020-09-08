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
import { GrantType } from '../grant-types/grant-type.model'

@Table({
  tableName: 'client_grant_type',
  indexes: [
    {
      fields: ['client_id', 'grant_type_id'],
    },
  ],
})
export class ClientGrantType extends Model<ClientGrantType> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => GrantType)
  @ApiProperty()
  grantType: string

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date
}
