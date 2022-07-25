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
  tableName: 'client_secret',
})
export class ClientSecret extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  value!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  expiration?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
