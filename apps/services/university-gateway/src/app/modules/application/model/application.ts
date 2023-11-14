import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ProgramTable } from '../../program/model/program'
import { ProgramModeOfDelivery } from '../../program/model/programModeOfDelivery'
import { University } from '../../university/model/university'
import { ApplicationStatus } from '@island.is/university-gateway'

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

  @ApiProperty({
    type: String,
  })
  @CreatedAt
  readonly created!: Date

  @ApiProperty({
    type: String,
  })
  @UpdatedAt
  readonly modified!: Date
}
