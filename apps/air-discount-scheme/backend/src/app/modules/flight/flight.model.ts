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

import type {
  Flight as TFlight,
  FlightLeg as TFlightLeg,
  UserInfo,
} from '@island.is/air-discount-scheme/types'
import {
  Actions,
  States,
  Airlines,
} from '@island.is/air-discount-scheme/consts'
import { createMachine } from 'xstate'

export const financialStateMachine = createMachine({
  id: 'flight_leg_financial_state_machine',
  initial: States.awaitingDebit,
  states: {
    [States.awaitingDebit]: {
      on: {
        [Actions.revoke]: States.cancelled,
        [Actions.send]: States.sentDebit,
      },
    },
    [States.sentDebit]: {
      on: { [Actions.revoke]: States.awaitingCredit },
    },
    [States.awaitingCredit]: {
      on: { [Actions.send]: States.sentCredit },
    },
    [States.sentCredit]: {
      type: 'final',
    },
    [States.cancelled]: {
      type: 'final',
    },
  },
})

@Table({ tableName: 'flight_leg' })
export class FlightLeg extends Model implements TFlightLeg {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  // eslint-disable-next-line
  @ForeignKey(() => Flight)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  flightId!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(Airlines),
    allowNull: false,
  })
  @ApiProperty()
  airline!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(Airlines),
  })
  @ApiProperty()
  cooperation?: string

  // eslint-disable-next-line
  @BelongsTo(() => Flight)
  flight: any

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  origin!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  destination!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isConnectingFlight!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  originalPrice!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  discountPrice!: number

  @Column({
    type: DataType.ENUM,
    values: Object.keys(financialStateMachine.states),
    allowNull: false,
    defaultValue: financialStateMachine.initialState.value,
  })
  @ApiProperty()
  financialState!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @ApiProperty()
  financialStateUpdated!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  readonly date!: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}

@Table({ tableName: 'flight' })
export class Flight extends Model implements TFlight {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  userInfo!: UserInfo

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  readonly bookingDate!: Date

  @HasMany(() => FlightLeg)
  @ApiProperty({ type: [FlightLeg] })
  flightLegs!: FlightLeg[]

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date

  @ApiProperty()
  @Column({
    type: DataType.BOOLEAN,
  })
  readonly connectable!: boolean
}
