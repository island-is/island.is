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
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'
  
  @Table({
    tableName: 'identity_resource',
    indexes: [
      {
        fields: ['id'],
      },
    ],
  })
  export class IdentityResource extends Model<IdentityResource> {
    @Column({
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    })
    @ApiProperty()
    id: string

    // Common properties for all resources (no single table inheritance)

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
      })
      @ApiProperty()
      enabled: boolean
    
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
      displayName: string
    
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      @ApiProperty()
      description: string
    
      @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
      })
      @ApiProperty()
      showInDiscoveryDocument: boolean

    // Common properties end
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    @ApiProperty()
    required: boolean
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    @ApiProperty()
    emphasize: boolean
  
    @CreatedAt
    @ApiProperty()
    readonly created: Date
  
    @UpdatedAt
    @ApiProperty()
    readonly modified: Date

    @HasMany(() => IdentityResourceUserClaim)
    @ApiProperty()
    public userClaims: IdentityResourceUserClaim[]

  }
