import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { createMachine } from 'xstate'

import {
  Actions,
  Airlines,
  States,
} from '@island.is/air-discount-scheme/consts'
import type {
  Flight as TFlight,
  FlightLeg as TFlightLeg,
  UserInfo as TUserInfo,
} from '@island.is/air-discount-scheme/types'
import { ExplicitCode } from '../discount/discount.model'

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

interface FlightLegCreationAttributes
  extends Optional<
    TFlightLeg,
    | 'id'
    | 'created'
    | 'modified'
    | 'financialState'
    | 'financialStateUpdated'
    | 'flight'
    | 'flightId'
  > {}

@Table({ tableName: 'flight_leg' })
export class FlightLeg
  extends Model<TFlightLeg, FlightLegCreationAttributes>
  implements TFlightLeg
{
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
  @ApiProperty({ type: () => Flight })
  flight?: TFlight

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

interface FlightCreationAttributes
  extends Optional<Omit<TFlight, 'flightLegs'>, 'id' | 'modified' | 'created'> {
  flightLegs: FlightLegCreationAttributes[]
}

@Table({ tableName: 'flight' })
export class Flight
  extends Model<TFlight, FlightCreationAttributes>
  implements TFlight
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ApiProperty({ type: () => UserInfo })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  userInfo!: TUserInfo

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
  @ApiProperty({ type: () => [FlightLeg], required: false })
  flightLegs?: FlightLeg[]

  @HasOne(() => ExplicitCode)
  explicitCode?: ExplicitCode

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

class UserInfo implements TUserInfo {
  @ApiProperty()
  age!: number

  @ApiProperty()
  gender!: 'kk' | 'kvk' | 'x' | 'manneskja'

  @ApiProperty()
  postalCode!: number
}
