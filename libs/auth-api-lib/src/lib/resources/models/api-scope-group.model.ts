import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiScope } from './api-scope.model'
import { Domain } from './domain.model'
import { Optional } from 'sequelize'

interface ModelAttributes {
  id: string
  name: string
  displayName: string
  description: string
  domainName: string
  order: number
  created: Date
  modified?: Date
  domain?: Domain
  scopes?: ApiScope[]
}

type CreationAttributes = Optional<ModelAttributes, 'id' | 'order' | 'created'>

@Table({
  tableName: 'api_scope_group',
})
export class ApiScopeGroup extends Model<ModelAttributes, CreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Finance',
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Finance heading',
  })
  displayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Description about the Finance group',
  })
  description!: string

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 999,
    },
  })
  @ApiProperty({
    example: 0,
  })
  order!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: '@island.is',
  })
  @ForeignKey(() => Domain)
  domainName!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiScope)
  @ApiPropertyOptional()
  scopes?: ApiScope[]

  @BelongsTo(() => Domain)
  @ApiPropertyOptional()
  domain?: Domain
}
