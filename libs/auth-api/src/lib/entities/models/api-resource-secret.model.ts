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
import { ApiResource } from './api-resource.model'
  
  @Table({
    tableName: 'api_resource_secret',
    indexes: [
      {
        fields: ['api_resource_id', 'value'],
      },
    ],
  })
  export class ApiResourceSecret extends Model<ApiResourceSecret> {
    @PrimaryKey
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ForeignKey(() => ApiResource)
    @ApiProperty({
      example: 'domain',
    })
    domain: string

    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
      })
    @ForeignKey(() => ApiResource)
    @ApiProperty()
    apiResourceName: string

    @PrimaryKey
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    value: string

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    @ApiProperty()
    description: string

    @Column({
        type: DataType.DATE,
        allowNull: true,
      })
    @ApiProperty()
    readonly expiration: Date

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    type: string
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date
  }
  