import {
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'session',
  updatedAt: false,
})
export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: CreationOptional<string>

  @Column
  actor!: string

  @Column
  subject!: string

  @Column
  clientId!: string

  @Column
  timestamp!: string

  @Column
  sessionId!: string

  @Column
  userAgent!: string

  @Column
  ip!: string

  @CreatedAt
  readonly created!: CreationOptional<Date>
}
