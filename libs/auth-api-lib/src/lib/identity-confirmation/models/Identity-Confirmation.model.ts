import {
  Column,
  CreatedAt,
  DataType,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'

@Table({
  tableName: 'identity_confirmation',
  timestamps: true,
})
export class IdentityConfirmation extends Model<
  InferAttributes<IdentityConfirmation>,
  InferCreationAttributes<IdentityConfirmation>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ticketId!: string

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
