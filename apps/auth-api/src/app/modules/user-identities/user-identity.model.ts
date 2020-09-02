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
import { Claim } from './claim.model'
  

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

    @Column({
      type: DataType.UUID,
      primaryKey: false,
      allowNull: true,
    })
    @ApiProperty()
    profile_id: string
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date

    @HasMany(() => Claim)
    @ApiProperty()
    readonly claims: Claim[]
  }
