import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ProgramModeOfDelivery, ProgramTable } from '../../program'
import { University } from '../../university'
import { ApplicationStatus } from '@island.is/university-gateway'

@Table({
  tableName: 'application',
})
export class Application extends Model {
  @ApiProperty({
    description:
      'Application ID, should be the same application GUID that is used in island.is application system',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiProperty({
    description: 'External ID for the application (from University)',
    example: 'ABC12345',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  externalId!: string

  @ApiProperty({
    description: 'Applicant national id',
    example: '1234567890',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => University)
  universityId!: string

  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProgramTable)
  programId!: string

  @ApiProperty({
    description: 'Program mode of delivery ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProgramModeOfDelivery)
  programModeOfDeliveryId!: string

  @ApiProperty({
    description: 'Application status',
    example: ApplicationStatus.IN_REVIEW,
    enum: ApplicationStatus,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(ApplicationStatus),
    allowNull: false,
  })
  status!: ApplicationStatus

  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
