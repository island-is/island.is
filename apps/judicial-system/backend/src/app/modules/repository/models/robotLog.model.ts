import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Case } from './case.model'

@Table({
  tableName: 'robot_log',
  timestamps: false,
})
export class RobotLog extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  @Column({ type: DataType.DATE })
  created!: Date

  @Column({ type: DataType.INTEGER })
  seqNumber!: number

  @Column({ type: DataType.BOOLEAN })
  delivered!: boolean

  @Column({ type: DataType.STRING, allowNull: false })
  type!: string

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: true })
  elementId?: string
}
