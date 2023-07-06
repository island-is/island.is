import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApplicationStatus } from '../types'
import { ModeOfDelivery } from '../../program/types'

@Table({
  tableName: 'application',
})
export class Application extends Model {
  @ApiProperty({
    description: 'Application ID',
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
  universityId!: string

  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  programId!: string

  @ApiProperty({
    description: 'What mode of delivery was selected in the application',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(ModeOfDelivery),
    allowNull: false,
  })
  modeOfDelivery!: ModeOfDelivery

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
}

export class ApplicationResponse {
  @ApiProperty({
    description: 'Application data',
    type: Application,
  })
  data!: Application
}
