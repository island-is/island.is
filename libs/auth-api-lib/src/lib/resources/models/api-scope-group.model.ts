import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
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

@Table({
  tableName: 'api_scope_group',
})
export class ApiScopeGroup extends Model<
  InferAttributes<ApiScopeGroup>,
  InferCreationAttributes<ApiScopeGroup>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  id!: CreationOptional<string>

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
  order!: CreationOptional<number>

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
  readonly created!: CreationOptional<Date>

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
