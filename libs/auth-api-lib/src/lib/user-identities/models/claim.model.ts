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
import { UserIdentity } from './user-identity.model'

@Table({
  tableName: 'claim',
})
export class Claim extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => UserIdentity)
  subjectId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  value!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  valueType!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  issuer!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  originalIssuer!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
