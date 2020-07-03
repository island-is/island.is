import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
export const ApplicationStates = {
  DRAFT: 'DRAFT',
  BEING_PROCESSED: 'BEING_PROCESSED',
  NEEDS_INFORMATION: 'NEEDS_INFORMATION',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  MANUAL_APPROVED: 'MANUAL_APPROVED',
  REJECTED: 'REJECTED',
  UNKNOWN: 'UNKNOWN',
} // TODO get from somewhere

@Table({
  timestamps: true,
  indexes: [
    {
      fields: ['typeId', 'applicant'],
    },
  ],
})
export class Application extends Model<Application> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id: string

  @CreatedAt
  created: Date

  @UpdatedAt
  modified: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  applicant: string

  @Column({
    type: DataType.STRING,
  })
  assignee: string

  @Column({
    type: DataType.STRING,
  })
  externalId: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationStates),
  })
  state: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  attatchments: string[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  typeId: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  answers: object
}
