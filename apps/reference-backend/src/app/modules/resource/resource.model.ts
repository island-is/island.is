import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'resource',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class Resource extends Model<Resource> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nationalId!: string

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
