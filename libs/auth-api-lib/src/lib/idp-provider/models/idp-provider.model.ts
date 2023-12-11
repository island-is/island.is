import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'idp_providers',
})
export class IdpProvider extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  helptext!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  level!: number

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
