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
import { Program } from './program'
import { ModeOfDelivery } from '@island.is/university-gateway-types'

@Table({
  tableName: 'program_mode_of_delivery',
})
export class ProgramModeOfDelivery extends Model {
  // @ApiProperty({
  //   description: 'Program mode of delivery ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  @ApiHideProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  // @ApiProperty({
  //   description: 'Program ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  @ApiHideProperty()
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

  // @ApiProperty({
  //   type: String,
  // })
  @ApiHideProperty()
  @CreatedAt
  readonly created!: Date

  // @ApiProperty({
  //   type: String,
  // })
  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: Date
}
