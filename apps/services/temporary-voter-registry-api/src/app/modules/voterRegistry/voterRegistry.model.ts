import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'voter_registry',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class VoterRegistry extends Model<VoterRegistry> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    defaultValue: DataType.INTEGER,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  regionNumber!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  regionName!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  version!: string

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
