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
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  actorNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subjectNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  clientId!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sessionId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userAgent!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ip!: string

  @CreatedAt
  readonly created!: CreationOptional<Date>
}
