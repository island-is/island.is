import {
  Column,
  CreatedAt,
  DataType,
  PrimaryKey,
  Table,
  UpdatedAt,
  Model,
} from 'sequelize-typescript'
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { IdentityConfirmationType } from '../types/identity-confirmation-type'

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
  ticketId!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(IdentityConfirmationType),
    allowNull: false,
  })
  type!: IdentityConfirmationType

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date
}
