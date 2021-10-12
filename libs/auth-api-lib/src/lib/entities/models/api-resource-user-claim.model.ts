import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ApiResource } from './api-resource.model'

@Table({
  tableName: 'api_resource_user_claim',
})
export class ApiResourceUserClaim extends Model<ApiResourceUserClaim> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ApiResource)
  @ApiProperty()
  apiResourceName!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  claimName!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
