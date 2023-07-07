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
import { ModeOfDelivery } from '../types'
import { Program } from './program'

@Table({
  tableName: 'program_mode_of_delivery',
})
export class ProgramModeOfDelivery extends Model {
  @ApiProperty({
    description: 'Program mode of delivery ID',
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
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Program)
  programId!: string

  @ApiProperty({
    description: 'Modes of deliveries available for the program',
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
