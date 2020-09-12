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
    tableName: 'api_resource_scope',
    indexes: [
      {
        fields: ['api_resource_id', 'scope_name'],
      },
    ],
  })
  export class ApiResourceScope extends Model<ApiResourceScope> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        allowNull: false,
      })
    @ForeignKey(() => ApiResource)
    @ApiProperty()
    apiResourceId: string

    @PrimaryKey
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    scopeName: string
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date
  }
  