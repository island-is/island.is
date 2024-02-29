import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
    type: DataType.UUIDV4,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sessionId!: string

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
    type: DataType.TEXT,
    allowNull: false,
  })
  userAgent!: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  device?: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ip!: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipLocation?: string

  @CreatedAt
  readonly created!: CreationOptional<Date>
}
