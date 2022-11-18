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
import { ApiScope } from './api-scope.model'
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Mínar síður Ísland.is',
  })
  @ApiProperty({
    example: 'Mínar síður Ísland.is',
  })
  displayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Stafrænt Ísland',
  })
  @ApiProperty({
    example: 'Stafrænt Ísland',
    description: 'This key is used to look up the organisation in Contentful.',
  })
  organisationLogoKey!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiScopeGroup)
  @ApiPropertyOptional()
  groups?: ApiScopeGroup[]

  @HasMany(() => ApiScope)
  @ApiPropertyOptional()
  scopes?: ApiScope[]
}
