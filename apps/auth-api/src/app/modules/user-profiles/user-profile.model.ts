import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
    HasMany,
  } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

  @Table({
    tableName: 'user_profile',
    indexes: [
      {
        fields: ['id'],
      },
    ],
  })
  export class UserProfile extends Model<UserProfile> {
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
    email: string
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    @ApiProperty()
    emailVerified: boolean
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    zoneInfo: string
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    locale: string
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    phoneNumber: string
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    @ApiProperty()
    phoneNumberVerified: boolean
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date

    // TODO: notifications and identity providers
  }
