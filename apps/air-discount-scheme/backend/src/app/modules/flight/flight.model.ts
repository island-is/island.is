import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

@Table({ tableName: 'flight_leg' })
export class FlightLeg extends Model<FlightLeg> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  // eslint-disable-next-line
  @ForeignKey(() => Flight)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  flightId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  origin: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  destination: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  originalPrice: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  discountPrice: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  readonly date: Date

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date
}

@Table({
  tableName: 'flight',
  indexes: [
    {
      fields: ['national_id', 'invalid'],
    },
  ],
})
export class Flight extends Model<Flight> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  invalid: boolean

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  readonly bookingDate: Date

  @HasMany(() => FlightLeg)
  @ApiProperty({ type: [FlightLeg] })
  flightLegs: FlightLeg[]

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date
}
