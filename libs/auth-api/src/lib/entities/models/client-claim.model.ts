import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    PrimaryKey,
  } from 'sequelize-typescript'
  import { ApiProperty } from '@nestjs/swagger'
  import { Client } from './client.model'
  
  @Table({
    tableName: 'client_claim',
    indexes: [
      {
        fields: ['client_id', 'value'],
      },
    ],
  })
  export class ClientClaim extends Model<ClientClaim> {
    @PrimaryKey
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
    @ApiProperty()
    type: string
    
    @PrimaryKey
    @Column({
    type: DataType.STRING,
    allowNull: false,
    })
    @ApiProperty()
    value: string
}