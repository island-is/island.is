import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

@Table({
  tableName: 'delegation_index_meta',
  timestamps: false,
})
export class DelegationIndexMeta extends Model<
  InferAttributes<DelegationIndexMeta>,
  InferCreationAttributes<DelegationIndexMeta>
> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  nationalId!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  lastFullReindex!: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  nextReindex!: Date
}
