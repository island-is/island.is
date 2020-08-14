import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

export enum ApplicationState {
  DRAFT = 'DRAFT',
  BEING_PROCESSED = 'BEING_PROCESSED',
  NEEDS_INFORMATION = 'NEEDS_INFORMATION',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  MANUAL_APPROVED = 'MANUAL_APPROVED',
  REJECTED = 'REJECTED',
  UNKNOWN = 'UNKNOWN',
} // TODO get from somewhere

@Table({
  tableName: 'application',
  timestamps: true,
  indexes: [
    {
      fields: ['type_id', 'applicant'],
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
  @ApiProperty()
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  applicant: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  assignee: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  externalId: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationState),
  })
  @ApiProperty({ enum: ApplicationState })
  state: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  attachments: string[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  typeId: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  @ApiProperty()
  answers: object
}
