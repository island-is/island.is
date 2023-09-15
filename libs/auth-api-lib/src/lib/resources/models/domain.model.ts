import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Client } from '../../clients/models/client.model'
import { ApiScopeGroup } from './api-scope-group.model'
import { ApiScope } from './api-scope.model'

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

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty({
    example: 'island@example.is',
  })
  contactEmail?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ApiScopeGroup)
  @ApiPropertyOptional({ type: () => [ApiScopeGroup] })
  groups?: ApiScopeGroup[]

  @HasMany(() => ApiScope)
  @ApiPropertyOptional({ type: () => [ApiScope] })
  scopes?: ApiScope[]

  @HasMany(() => Client)
  @ApiPropertyOptional({ type: () => [Client] })
  clients?: Client[]
}
