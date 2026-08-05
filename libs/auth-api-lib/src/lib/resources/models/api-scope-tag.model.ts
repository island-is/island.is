import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

import { ApiScope } from './api-scope.model'

@Table({
  tableName: 'api_scope_tag',
  timestamps: true,
})
export class ApiScopeTag extends Model<
  InferAttributes<ApiScopeTag>,
  InferCreationAttributes<ApiScopeTag>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => ApiScope)
  @ApiProperty()
  scopeName!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    description: 'External CMS ID for the tag (e.g., Contentful sys.id)',
  })
  tagId!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @BelongsTo(() => ApiScope)
  apiScope?: ApiScope
}
