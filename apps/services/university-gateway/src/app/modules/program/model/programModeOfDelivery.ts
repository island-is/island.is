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
import { ProgramTable } from './program'
import { ModeOfDelivery } from '@island.is/university-gateway'

@Table({
  tableName: 'program_mode_of_delivery',
})
export class ProgramModeOfDelivery extends Model {
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProgramTable)
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

  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
