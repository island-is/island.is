import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
  } from 'sequelize-typescript'
  import { ApiProperty } from '@nestjs/swagger'
  
  @Table({
    tableName: 'user_identity',
    indexes: [
      {
        fields: ['id'],
      },
    ],
  })
  export class UserIdentity extends Model<UserIdentity> {
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
      unique: true,
    })
    @ApiProperty()
    subjectId: string
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    name: string
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    providerName: string
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    @ApiProperty()
    providerSubjectId: string
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date
  }
  