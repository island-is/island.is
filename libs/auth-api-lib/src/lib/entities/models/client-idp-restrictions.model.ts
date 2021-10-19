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
  tableName: 'client_idp_restrictions',
})
export class ClientIdpRestrictions extends Model<ClientIdpRestrictions> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
