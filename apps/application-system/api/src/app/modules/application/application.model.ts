import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ApplicationTypes,
  ApplicationStatus,
} from '@island.is/application/core'

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
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  applicant!: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  assignees!: string[]

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  state!: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  @ApiPropertyOptional()
  attachments?: object

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationTypes),
  })
  @ApiProperty({ enum: ApplicationTypes })
  typeId!: ApplicationTypes

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  @ApiProperty()
  answers!: object

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  @ApiProperty()
  externalData!: object

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationStatus),
    defaultValue: ApplicationStatus.IN_PROGRESS,
  })
  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  isListed!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiPropertyOptional()
  pruneAt?: Date
  
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  paymentReference?: string
}

///Payment table to hold onto fulfilled payments and expiring payments.
@Table({
  tableName: 'payment',
  timestamps: true,
  indexes: [
    {
      fields: ['applicationId'],
    },
  ],
})
export class Payment extends Model<Application> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string
  
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ApplicationId!: string
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  fulfilled!: boolean
  
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  referenceId!: string
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  user4!: string
  
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  @ApiPropertyOptional()
  definition?: object
  
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty()
  amount!: number

  @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
  })
  @ApiProperty()
  expiresAt!: Date
}