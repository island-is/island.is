import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'

import {
  Flight as TFlight,
  FlightLeg as TFlightLeg,
} from '@island.is/air-discount-scheme/types'
import { environment } from '../../../environments'
import { createMachine } from 'xstate'

export const financialStateMachine = createMachine({
  id: 'flight_leg_financial_state_machine',
  initial: 'awaitingDebit',
  states: {
    awaitingDebit: {
      on: { REVOKE: 'cancelled', SEND: 'sentDebit' },
    },
    sentDebit: {
      on: { REVOKE: 'awaitingCredit' },
    },
    awaitingCredit: {
      on: { SEND: 'sentCredit' },
    },
    sentCredit: {
      type: 'final',
    },
    cancelled: {
      type: 'final',
    },
  },
})

@Table({ tableName: 'flight_leg' })
export class FlightLeg extends Model<FlightLeg> implements TFlightLeg {
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

  // eslint-disable-next-line
  @BelongsTo(() => Flight)
  flight

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
    type: DataType.ENUM,
    values: Object.keys(financialStateMachine.states),
    allowNull: false,
    defaultValue: financialStateMachine.initialState.value,
  })
  @ApiProperty()
  financialState: string

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

@Table({ tableName: 'flight' })
export class Flight extends Model<Flight> implements TFlight {
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
    type: DataType.ENUM,
    values: Object.keys(environment.airlineApiKeys),
    allowNull: false,
  })
  @ApiProperty()
  airline: string

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
