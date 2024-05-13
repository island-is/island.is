import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Case } from '../../case/models/case.model'

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
  @Column({ type: DataType.DATE, allowNull: false })
  created!: Date

  @Column({ type: DataType.INTEGER, allowNull: false })
  seqNumber!: number

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  delivered!: boolean

  @Column({ type: DataType.STRING, allowNull: false })
  type!: string

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: true })
  elementId?: string
}
