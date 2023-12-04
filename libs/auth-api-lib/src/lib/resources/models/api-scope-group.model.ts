import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

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
  @ApiProperty({ type: String })
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
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 999,
    },
  })
  @ApiProperty({
    type: Number,
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
  @ApiProperty({ type: Date })
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiScope)
  @ApiPropertyOptional({ type: () => [ApiScope] })
  scopes?: ApiScope[]

  @BelongsTo(() => Domain)
  @ApiPropertyOptional({ type: () => Domain })
  domain?: Domain
}
