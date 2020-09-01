import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationState, FormType } from '@island.is/application/schema'

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
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  attachments: string[]

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FormType),
  })
  @ApiProperty({ enum: FormType })
  typeId: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  @ApiProperty()
  answers: object

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
    allowNull: false,
  })
  @ApiProperty()
  externalData: object
}
