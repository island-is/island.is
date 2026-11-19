import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ApplicationTypes,
  ApplicationStatus,
} from '@island.is/application/types'
import { Expose } from 'class-transformer'

@Table({
  tableName: 'application',
  timestamps: true,
  indexes: [
    {
      fields: ['type_id', 'applicant'],
    },
  ],
})
export class Application extends Model {
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
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  applicantActors!: string[]

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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  userDeleted!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiPropertyOptional()
  userDeletedAt?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiPropertyOptional()
  pruneAt?: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  pruned!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiPropertyOptional()
  postPruneAt?: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  postPruned!: boolean

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  assignNonces!: string[]

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  draftFinishedSteps!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  draftTotalSteps!: number
}

export class ApplicationPaginatedResponse {
  @ApiProperty({ type: [Application] })
  @Expose()
  rows!: Application[]
  @ApiProperty()
  @Expose()
  count!: number
}

export class ApplicationsStatistics {
  @ApiProperty()
  @Expose()
  typeid!: string

  @ApiProperty()
  @Expose()
  count!: number

  @ApiProperty()
  @Expose()
  draft!: number

  @ApiProperty()
  @Expose()
  inprogress!: number

  @ApiProperty()
  @Expose()
  completed!: number

  @ApiProperty()
  @Expose()
  rejected!: number

  @ApiProperty()
  @Expose()
  approved!: number

  @ApiProperty()
  @Expose()
  name?: string
}
