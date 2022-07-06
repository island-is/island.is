import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiScopeGroup } from './api-scope-group.model'

@Table({
  tableName: 'domain',
})
export class Domain extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({ example: '@island.is' })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Domain for Island.is',
  })
  description!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: '0123456789',
  })
  nationalId!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiScopeGroup)
  @ApiPropertyOptional()
  groups?: ApiScopeGroup[]
}
