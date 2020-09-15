import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
    ForeignKey,
  } from 'sequelize-typescript'
  import { ApiProperty } from '@nestjs/swagger'
import { UserIdentity } from './user-identity.model'
  
  @Table({
    tableName: 'claim',
    indexes: [
      {
        fields: ['id'],
      },
    ],
  })
  export class Claim extends Model<Claim> {
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
      type: string
  
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      @ApiProperty()
      value: string
  
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      @ApiProperty()
      valueType: string
  
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      @ApiProperty()
      issuer: string
  
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      @ApiProperty()
      originalIssuer: string
  
      @CreatedAt
      @ApiProperty()
      readonly created: Date
    
      @UpdatedAt
      @ApiProperty()
      readonly modified: Date

      @ForeignKey(() => UserIdentity)
      userIdentityId: string
  }