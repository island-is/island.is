import { ApiProperty } from '@nestjs/swagger'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

@Table({
  tableName: 'session',
  updatedAt: false,
})
export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  id!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  actorNationalId!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subjectNationalId!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  clientId!: string

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp!: Date

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userAgent!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ip!: string

  @CreatedAt
  readonly created!: CreationOptional<Date>
}
